const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\Anand\\.gemini\\antigravity\\brain\\c3b48375-de51-4099-8580-47fc82f624ee\\.system_generated\\steps\\1307\\content.md', 'utf8');

const set = new Set();
for (const m of content.matchAll(/[?&]v=([a-zA-Z0-9_-]{11})/g)) set.add(m[1]);
for (const m of content.matchAll(/\/vi\/([a-zA-Z0-9_-]{11})\//g)) set.add(m[1]);
for (const m of content.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)) set.add(m[1]);

console.log('Total unique candidates:', set.size);
console.log([...set]);

