# Acme Careers — Static Job Advertising Demo

This is a simple static website that advertises jobs and provides an interactive UI to search/filter and apply. It is intentionally a client-side demo (no backend). Applications are stored locally in the browser's localStorage to simulate submission.

How to use

- Open `index.html` in your browser (double-click or open with Live Server)
- Browse roles, use the search box and filters.
- Click "Apply" to open the apply modal. Submissions are saved to localStorage under the key `acme_applications_v1`.

Files added/updated

- `index.html` — main page and layout
- `index.css` — styles
- `scripts.js` — client-side logic (fetches `jobs.json`, filters, opens modal, stores applications)
- `jobs.json` — sample job postings
- `README.md` — this file

Notes & next steps

- This is a static demo. To make real applications work, implement a server endpoint to accept file uploads and application payloads.
- You can extend features: pagination, sort, company pages, login, or integrate with an ATS.

Enjoy! Open `index.html` to try the site.
