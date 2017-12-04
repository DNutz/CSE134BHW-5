importScripts('workbox-sw.dev.v2.1.2.js');
const workboxSW = new WorkboxSW();
workboxSW.precache([
    {
        "url": "index.html"
    }
]);