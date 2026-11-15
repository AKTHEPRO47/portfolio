import { audit, limits, numeric, parseCsv, predict, sampleCsv, scoreBatch, trainModel } from './ml-core.mjs';

const get = id => document.getElementById(id);
const trainingForm = get('trainingForm');
const { target, task, fraction, seed } = trainingForm.elements;
const trainingFile = get('trainingFile');
const batchFile = get('batchFile');
const dropZone = get('dropZone');
const scenarioForm = get('scenarioForm');
const sweepFeature = get('sweepFeature');
const format = new Intl.NumberFormat(undefined, { maximumSignificantDigits: 5 });
const percent = new Intl.NumberFormat(undefined, { style: 'percent', maximumFractionDigits: 1 });
let data, columns, trained, scoredCsv;
let dataRequest = 0, batchRequest = 0;

function status(id, message = '', error = false) {
    const element = get(id);
    element.textContent = message;
    element.dataset.error = String(error);
}

function node(tag, text) {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    return element;
}

function renderTable(id, title, headings, rows) {
    const table = node('table');
    table.createCaption().textContent = title;
    const header = table.createTHead().insertRow();
    headings.forEach(value => {
        const cell = node('th', value);
        cell.scope = 'col';
        header.append(cell);
    });
    const body = table.createTBody();
    rows.forEach(values => {
        const row = body.insertRow();
        const label = node('th', values[0]);
        label.scope = 'row';
        row.append(label);
        values.slice(1).forEach(value => { row.insertCell().textContent = value; });
    });
    get(id).replaceChildren(table);
}

function closeResults() {
    trained = undefined;
    clearBatch();
    get('labResults').hidden = true;
}

function clearBatch() {
    batchRequest++;
    scoredCsv = undefined;
    batchFile.value = '';
    get('downloadPredictions').disabled = true;
    status('batchStatus');
}

function resetSession() {
    dataRequest++;
    data = undefined;
    columns = undefined;
    trainingFile.value = '';
    trainingForm.reset();
    target.replaceChildren();
    get('featureOptions').replaceChildren();
    get('trainingOptions').disabled = true;
    get('auditPanel').hidden = true;
    get('auditPanel').open = false;
    get('auditTable').replaceChildren();
    scenarioForm.replaceChildren();
    sweepFeature.replaceChildren();
    ['metricsTable', 'confusionTable', 'sweepTable', 'modelSummary', 'scenarioResult']
        .forEach(id => get(id).replaceChildren());
    status('dataStatus', 'Session cleared.');
    status('trainStatus');
    closeResults();
    trainingFile.focus();
}

function showFeatureChoices() {
    const choices = columns.filter(column => column.numeric && column.distinct > 1 && column.name !== target.value);
    const toggles = choices.map(({ name }, index) => {
        const label = node('label');
        const checkbox = node('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'feature';
        checkbox.value = name;
        checkbox.checked = index < limits.features;
        label.append(checkbox, document.createTextNode(name));
        return label;
    });
    get('featureOptions').replaceChildren(...(toggles.length ? toggles : [node('p', 'No varying numeric inputs found.')]));
    get('trainButton').disabled = !choices.length;
}

function loadDataset(text, label, sampleTask) {
    const parsed = parseCsv(text);
    const profile = audit(parsed);
    data = parsed;
    columns = profile;
    closeResults();
    get('trainingOptions').disabled = false;
    target.replaceChildren(...data.headers.map(name => new Option(name, name)));
    target.value = data.headers.at(-1);
    task.value = sampleTask ?? (profile.at(-1).numeric ? 'regression' : 'classification');
    status('trainStatus');
    showFeatureChoices();
    renderTable('auditTable', 'Column summary', ['Column', 'Type', 'Missing', 'Distinct', 'Range'],
        columns.map(column => [
            column.name,
            column.numeric ? 'Numeric' : 'Text or mixed',
            column.missing,
            column.distinct,
            column.range ? column.range.map(number => format.format(number)).join(' to ') : '—'
        ]));
    get('auditPanel').hidden = false;
    status('dataStatus', label + ': ' + format.format(data.rows.length) + ' rows, ' + data.headers.length + ' columns.');
}

async function csvText(file) {
    if (file.size > limits.bytes) throw new Error('Choose a CSV under 1 MB.');
    return file.text();
}

async function loadTrainingFile(file) {
    if (!file) return;
    const request = ++dataRequest;
    try {
        const text = await csvText(file);
        if (request === dataRequest) loadDataset(text, file.name);
    } catch (error) {
        if (request === dataRequest) status('dataStatus', error.message + (data ? ' The previous dataset is still loaded.' : ''), true);
    } finally {
        if (request === dataRequest) trainingFile.value = '';
    }
}

function showEvaluation(result) {
    const { model, metrics, baseline, counts } = result;
    const evaluation = model.classes
        ? [['Accuracy', 'accuracy', percent], ['Balanced accuracy', 'balanced', percent]]
        : [['Mean absolute error ↓', 'mae', format], ['Root mean squared error ↓', 'rmse', format]];
    const method = model.classes ? 'Regularized logistic classification' : 'Ridge regression';
    const baselineName = model.classes ? 'Most common label' : 'Training mean';
    get('modelSummary').textContent = method + ' for ' + model.target + '. ' + counts.train + ' training rows, '
        + counts.test + ' held out, ' + counts.omitted + ' omitted for missing or invalid values.';
    renderTable('metricsTable', 'Model versus baseline', ['Metric', 'Trained model', baselineName],
        evaluation.map(([label, key, formatter]) => [label, formatter.format(metrics[key]), formatter.format(baseline[key])]));
    if (model.classes) {
        renderTable('confusionTable', 'Confusion matrix', ['Actual ↓ / Predicted →', ...model.classes],
            metrics.confusion.map((row, index) => [model.classes[index], ...row]));
    } else {
        get('confusionTable').replaceChildren();
    }
}

function describe(prediction) {
    if (prediction.probability === undefined) return format.format(prediction.value);
    return prediction.value + ' · ' + percent.format(prediction.probability) + ' model probability';
}

function updateScenario() {
    const { model } = trained;
    const inputs = Array.from(scenarioForm.elements, element => numeric(element.value));
    if (inputs.includes(null)) {
        get('scenarioResult').textContent = 'Enter a valid number in every input.';
        get('sweepTable').replaceChildren();
        return;
    }
    const outOfRange = inputs.some((value, index) => value < model.ranges[index][0] || value > model.ranges[index][1]);
    get('scenarioResult').textContent = model.target + ': ' + describe(predict(model, inputs))
        + (outOfRange ? ' · Input outside the training range' : '');

    const index = Number(sweepFeature.value);
    const [min, max] = model.ranges[index];
    const values = min === max ? [min] : Array.from({ length: 5 }, (_, step) => min + step * (max - min) / 4);
    const rows = values.map(value => {
        const scenario = inputs.slice();
        scenario[index] = value;
        return [format.format(value), describe(predict(model, scenario))];
    });
    renderTable('sweepTable', 'One input varied, others held fixed', [model.features[index], 'Predicted ' + model.target], rows);
}

function setupScenario(model) {
    scenarioForm.replaceChildren(...model.features.map((feature, index) => {
        const label = node('label', feature);
        const input = node('input');
        input.type = 'number';
        input.step = 'any';
        input.value = Number(model.means[index].toPrecision(12));
        label.append(input);
        return label;
    }));
    sweepFeature.replaceChildren(...model.features.map((name, index) => new Option(name, index)));
    updateScenario();
}

function runTraining(event) {
    event.preventDefault();
    closeResults();
    const features = new FormData(trainingForm).getAll('feature');
    try {
        trained = trainModel(data, {
            target: target.value, task: task.value, features,
            fraction: Number(fraction.value), seed: Number(seed.value)
        });
        showEvaluation(trained);
        setupScenario(trained.model);
        get('labResults').hidden = false;
        status('trainStatus', 'Model trained. Holdout results and prediction tools are ready below.');
    } catch (error) {
        status('trainStatus', error.message, true);
    }
}

function csvCell(value) {
    let content = String(value ?? '');
    // Keep untrusted headers and labels from becoming formulas when a CSV opens in a spreadsheet.
    if (/^[=+\-@]/.test(content) && numeric(content) === null) content = "'" + content;
    return '"' + content.replaceAll('"', '""') + '"';
}

function uniqueColumn(headers, name) {
    let candidate = name;
    let suffix = 2;
    while (headers.includes(candidate)) candidate = name + '_' + suffix++;
    return candidate;
}

async function scoreFile(file) {
    if (!file || !trained) return;
    clearBatch();
    const request = batchRequest;
    const { model } = trained;
    try {
        const text = await csvText(file);
        if (request !== batchRequest) return;
        const dataset = parseCsv(text);
        const predictions = scoreBatch(model, dataset);
        const headers = [...dataset.headers, uniqueColumn(dataset.headers, 'ml_prediction')];
        if (model.classes) headers.push(uniqueColumn(headers, 'ml_probability'));
        const rows = dataset.rows.map((row, index) => {
            const prediction = predictions[index];
            const result = [...row, prediction?.value];
            if (model.classes) result.push(prediction?.probability);
            return result;
        });
        const completed = predictions.filter(Boolean).length;
        scoredCsv = [headers, ...rows].map(row => row.map(csvCell).join(',')).join('\r\n');
        get('downloadPredictions').disabled = completed === 0;
        status('batchStatus', completed + ' of ' + dataset.rows.length + ' rows scored.'
            + (completed < dataset.rows.length ? ' Rows with invalid inputs have blank predictions.' : ''), completed === 0);
    } catch (error) {
        if (request === batchRequest) status('batchStatus', error.message, true);
    }
}

function download(filename, mime, contents) {
    const url = URL.createObjectURL(new Blob([contents], { type: mime }));
    const anchor = node('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

trainingFile.addEventListener('change', () => loadTrainingFile(trainingFile.files[0]));
dropZone.addEventListener('dragover', event => {
    event.preventDefault();
    dropZone.dataset.over = 'true';
});
dropZone.addEventListener('dragleave', event => {
    if (!dropZone.contains(event.relatedTarget)) delete dropZone.dataset.over;
});
dropZone.addEventListener('drop', event => {
    event.preventDefault();
    delete dropZone.dataset.over;
    loadTrainingFile(event.dataTransfer.files[0]);
});
document.querySelectorAll('[data-sample]').forEach(button => {
    button.addEventListener('click', () => {
        dataRequest++;
        trainingFile.value = '';
        const example = button.dataset.sample;
        const name = example === 'classification' ? 'Synthetic weather data' : 'Synthetic rent data';
        loadDataset(sampleCsv(example), name, example);
    });
});

target.addEventListener('change', () => {
    task.value = columns.find(column => column.name === target.value).numeric ? 'regression' : 'classification';
    showFeatureChoices();
});
trainingForm.addEventListener('change', () => {
    if (!trained) return;
    closeResults();
    status('trainStatus', 'Settings changed. Train again to update the results.');
});
trainingForm.addEventListener('submit', runTraining);
get('resetLab').addEventListener('click', resetSession);
scenarioForm.addEventListener('submit', event => event.preventDefault());
scenarioForm.addEventListener('input', updateScenario);
sweepFeature.addEventListener('change', updateScenario);
batchFile.addEventListener('change', () => scoreFile(batchFile.files[0]));
get('downloadPredictions').addEventListener('click', () => download('ml-lab-predictions.csv', 'text/csv;charset=utf-8', scoredCsv));
get('downloadModel').addEventListener('click', () => download('ml-lab-model.json', 'application/json', JSON.stringify({
    ...trained, split: { holdout: Number(fraction.value), seed: Number(seed.value) }
}, null, 2)));
get('labWorkspace').hidden = false;
