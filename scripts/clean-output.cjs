const fs = require('node:fs');
const path = require('node:path');

// Only the configured generated output, never sources or legacy snapshots.
fs.rmSync(path.resolve(__dirname, '../_site'), { recursive: true, force: true });
