const form = document.getElementById('bookingForm');
const date = form.elements.date;
const time = form.elements.time;
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const dateParts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
}).formatToParts(new Date());
const today = Object.fromEntries(dateParts.map(({ type, value }) => [type, value]));

date.min = [today.year, today.month, today.day].join('-');
document.getElementById('bookingTimezone').textContent = 'Your time zone: ' + timezone;
form.hidden = false;

form.addEventListener('input', () => time.setCustomValidity(''));
form.addEventListener('submit', event => {
    event.preventDefault();
    const preferred = new Date(date.value + 'T' + time.value);
    if (preferred <= new Date()) {
        time.setCustomValidity('Choose a future date and time.');
        time.reportValidity();
        return;
    }

    const display = new Intl.DateTimeFormat(undefined, {
        dateStyle: 'full',
        timeStyle: 'short'
    }).format(preferred);
    const body = [
        'Hi Aryan,',
        '',
        'Could we meet on ' + display + ' (' + timezone + ')?',
        '',
        'What I would like to discuss:',
        '',
        'Thanks!'
    ].join('\n');
    window.location.href = 'mailto:aryan@akitavault.com?subject=Meeting%20request&body=' + encodeURIComponent(body);
});
