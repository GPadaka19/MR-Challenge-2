```mermaid
flowchart TD
    index_html[index.html]
    apps_js[apps.js]
    video[Video & Canvas]
    fire[Emoji Api]

    index_html -->|Memuat| apps_js
    index_html --> video
    index_html --> fire
    apps_js -->|Mengakses| video
    apps_js -->|Mengatur & Menampilkan| fire
``` 