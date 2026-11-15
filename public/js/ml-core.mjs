export const limits = { rows: 2500, columns: 40, features: 20, classes: 8, bytes: 1_000_000 };

export function parseCsv(text) {
    const records = [];
    let record = [];
    let field = '';
    let quoted = false;
    let closed = false;
    text = text.replace(/^\uFEFF/, '');

    function endField() {
        record.push(field.trim());
        if (record.length > limits.columns) throw new Error('Use a CSV with at most 40 columns.');
        field = '';
        closed = false;
    }

    function endRecord() {
        endField();
        if (record.some(value => value !== '')) records.push(record);
        if (records.length > limits.rows + 1) throw new Error('Use a CSV with at most 2,500 rows.');
        record = [];
    }

    for (let index = 0; index < text.length; index++) {
        const char = text[index];
        if (quoted) {
            if (char !== '"') field += char;
            else if (text[index + 1] === '"') {
                field += '"';
                index++;
            } else {
                quoted = false;
                closed = true;
            }
        } else if (char === ',') {
            endField();
        } else if (char === '\n' || char === '\r') {
            endRecord();
            if (char === '\r' && text[index + 1] === '\n') index++;
        } else if (char === '"' && !field && !closed) {
            quoted = true;
        } else if (char === '"' || closed) {
            throw new Error('Check the CSV for misplaced quotes.');
        } else {
            field += char;
        }
    }

    if (quoted) throw new Error('An open quote was found at the end of the CSV.');
    if (record.length || field || closed) endRecord();
    const [headers, ...rows] = records;
    if (!headers || !rows.length) throw new Error('Include a header row and at least one data row.');
    if (headers.some(value => !value) || new Set(headers).size !== headers.length) {
        throw new Error('Column names must be non-empty and unique.');
    }
    if (rows.some(row => row.length !== headers.length)) {
        throw new Error('Every row must have the same number of columns as the header.');
    }
    return { headers, rows };
}

export function numeric(value) {
    if (value === '' || value === undefined) return null;
    const number = Number(value);
    return Number.isFinite(number) && Math.abs(number) <= 1e12 ? number : null;
}

export function audit({ headers, rows }) {
    return headers.map((name, index) => {
        const values = rows.map(row => row[index]).filter(value => value !== '');
        const numbers = values.map(numeric);
        const isNumeric = values.length > 0 && numbers.every(value => value !== null);
        const distinct = new Set(isNumeric ? numbers : values);
        return {
            name, numeric: isNumeric, missing: rows.length - values.length, distinct: distinct.size,
            range: isNumeric ? [Math.min(...numbers), Math.max(...numbers)] : null
        };
    });
}

function shuffle(values, seed) {
    const result = [...values];
    let state = seed >>> 0;
    for (let index = result.length - 1; index > 0; index--) {
        state = (Math.imul(1664525, state) + 1013904223) >>> 0;
        const other = Math.floor(state / 4294967296 * (index + 1));
        [result[index], result[other]] = [result[other], result[index]];
    }
    return result;
}

function partition(rows, classes, seed, fraction) {
    const groups = classes ? classes.map(label => rows.filter(row => row.y === label)) : [rows];
    const train = [];
    const test = [];
    groups.forEach((group, index) => {
        const mixed = shuffle(group, seed + index);
        const count = Math.max(1, Math.round(mixed.length * fraction));
        test.push(...mixed.slice(0, count));
        train.push(...mixed.slice(count));
    });
    return { train, test };
}

function softmax(scores) {
    const max = Math.max(...scores);
    const exponents = scores.map(value => Math.exp(value - max));
    const total = exponents.reduce((sum, value) => sum + value, 0);
    return exponents.map(value => value / total);
}

function argmax(values) {
    return values.reduce((best, value, index) => value > values[best] ? index : best, 0);
}

function score(weights, features) {
    return weights.reduce((total, weight, index) => total + weight * features[index], 0);
}

export function predict(model, features) {
    const input = [1, ...features.map((value, index) => (value - model.means[index]) / model.scales[index])];
    const scores = model.weights.map(weights => score(weights, input));
    if (!model.classes) return { value: scores[0] * model.targetScale + model.targetMean };
    const probabilities = softmax(scores);
    const winner = argmax(probabilities);
    return { value: model.classes[winner], probability: probabilities[winner] };
}

function evaluate(rows, infer, classes) {
    const estimates = rows.map(infer);
    if (classes) {
        const confusion = classes.map(() => classes.map(() => 0));
        rows.forEach((row, index) => confusion[classes.indexOf(row.y)][classes.indexOf(estimates[index])]++);
        const accuracy = rows.filter((row, index) => row.y === estimates[index]).length / rows.length;
        const balanced = confusion.reduce((sum, row, index) => sum + row[index] / row.reduce((a, b) => a + b, 0), 0) / classes.length;
        return { accuracy, balanced, confusion };
    }
    const errors = rows.map((row, index) => row.y - estimates[index]);
    const mae = errors.reduce((sum, value) => sum + Math.abs(value), 0) / rows.length;
    const rmse = Math.sqrt(errors.reduce((sum, value) => sum + value ** 2, 0) / rows.length);
    return { mae, rmse };
}

export function trainModel(dataset, options) {
    const { target, features, task, fraction, seed } = options;
    const targetIndex = dataset.headers.indexOf(target);
    const featureIndices = features.map(name => dataset.headers.indexOf(name));
    if (targetIndex < 0 || !features.length || features.length > limits.features
        || new Set(features).size !== features.length || featureIndices.some(index => index < 0 || index === targetIndex)
        || !['regression', 'classification'].includes(task) || ![0.2, 0.25, 0.3].includes(fraction)
        || !Number.isInteger(seed) || seed < 0 || seed > 4294967295) {
        throw new Error('Choose a target, 1–20 different numeric inputs, a valid split and an integer seed.');
    }
    const classification = task === 'classification';
    const usable = dataset.rows.map(row => ({
        x: featureIndices.map(index => numeric(row[index])),
        y: classification ? row[targetIndex] : numeric(row[targetIndex])
    })).filter(row => row.y !== '' && row.y !== null && row.x.every(value => value !== null));

    if (usable.length < 24) throw new Error('Use at least 24 rows with valid values in the selected columns.');
    if (new Set(usable.map(row => row.y)).size < 2) throw new Error('The target must contain at least two distinct values.');
    const classes = classification ? [...new Set(usable.map(row => row.y))].sort() : null;
    if (classes && (classes.length > limits.classes || classes.some(label => usable.filter(row => row.y === label).length < 5))) {
        throw new Error('Classification needs 2–8 labels with at least five usable rows per label.');
    }

    const { train, test } = partition(usable, classes, seed, fraction);
    const means = features.map((_, index) => train.reduce((sum, row) => sum + row.x[index], 0) / train.length);
    const scales = features.map((_, index) => Math.sqrt(train.reduce((sum, row) => sum + (row.x[index] - means[index]) ** 2, 0) / train.length) || 1);
    const ranges = features.map((_, index) => [Math.min(...train.map(row => row.x[index])), Math.max(...train.map(row => row.x[index]))]);
    const targetMean = classes ? 0 : train.reduce((sum, row) => sum + row.y, 0) / train.length;
    const targetScale = classes ? 1 : Math.sqrt(train.reduce((sum, row) => sum + (row.y - targetMean) ** 2, 0) / train.length) || 1;
    const encoded = train.map(row => ({
        x: [1, ...row.x.map((value, index) => (value - means[index]) / scales[index])],
        y: classes ? classes.indexOf(row.y) : (row.y - targetMean) / targetScale
    }));

    // Regularized full-batch gradient descent with standardized training inputs.
    const weights = Array.from({ length: classes?.length ?? 1 }, () => Array(features.length + 1).fill(0));
    const step = 0.7 / (features.length + 1);
    for (let iteration = 0; iteration < 180; iteration++) {
        const gradients = weights.map(row => row.map(() => 0));
        for (const row of encoded) {
            const scores = weights.map(coefs => score(coefs, row.x));
            const outputs = classes ? softmax(scores) : scores;
            outputs.forEach((output, label) => {
                const expected = classes ? Number(label === row.y) : row.y;
                const error = output - expected;
                row.x.forEach((value, index) => { gradients[label][index] += error * value; });
            });
        }
        weights.forEach((coefs, label) => coefs.forEach((weight, index) => {
            coefs[index] -= step * (gradients[label][index] / encoded.length + (index === 0 ? 0 : 0.015 * weight));
        }));
    }

    const baselineValue = classes
        ? classes[argmax(classes.map(label => train.filter(row => row.y === label).length))]
        : targetMean;
    const model = { version: 1, task, target, features, classes, means, scales, ranges, targetMean, targetScale, weights };
    return {
        model,
        metrics: evaluate(test, row => predict(model, row.x).value, classes),
        baseline: evaluate(test, () => baselineValue, classes),
        counts: { train: train.length, test: test.length, omitted: dataset.rows.length - usable.length }
    };
}

export function scoreBatch(model, dataset) {
    const indices = model.features.map(name => dataset.headers.indexOf(name));
    const missing = model.features.filter((_, index) => indices[index] < 0);
    if (missing.length) throw new Error('Missing model inputs: ' + missing.join(', '));
    return dataset.rows.map(row => {
        const input = indices.map(index => numeric(row[index]));
        return input.includes(null) ? null : predict(model, input);
    });
}

export function sampleCsv(task) {
    const seed = task === 'classification' ? 81 : 203;
    let state = seed;
    function random() {
        state = (Math.imul(1664525, state) + 1013904223) >>> 0;
        return state / 4294967296;
    }
    const classify = task === 'classification';
    const header = classify ? 'temperature_c,rainfall_mm,humidity_pct,weather' : 'area_m2,travel_minutes,bedrooms,monthly_rent';
    const rows = Array.from({ length: 180 }, () => {
        const a = random(), b = random(), c = random(), jitter = random();
        if (classify) {
            const weather = b + c * 0.38 - a * 0.12 + jitter * 0.15 > 0.63 ? 'rainy' : 'dry';
            return [Math.round(23 + a * 11), Math.round(b * 35), Math.round(45 + c * 53), weather];
        }
        const area = Math.round(25 + a * 110), travel = Math.round(5 + b * 38), beds = Math.round(1 + c * 3);
        return [area, travel, beds, Math.round(1200 + 16 * area - 12 * travel + 150 * beds + jitter * 220)];
    });
    return [header, ...rows.map(row => row.join(','))].join('\n');
}
