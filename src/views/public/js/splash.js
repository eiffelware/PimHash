const fetch = require('node-fetch');
var progress = document.getElementById('progressBar');
var a = document.getElementById('text');

fetch(`https://www.eiffelware.net/api/apps/pimhash/0.1.1`, {
    method: 'get'
}).then((r) => r.json()).then((b) => {
    console.log(b);
    console.log(require('electron'));
    if (!b.auth) return a.innerHTML = "Not Authorized.", setTimeout(() => { window.close() }, 1395);
    if (!b.update) return progress.style = "width: 100%;", setTimeout(() => { window.close() }, 1395);
    if (b.update) return window.open(b.url), a.innerHTML = b.updateText;
});