const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\Anand\\.gemini\\antigravity\\brain\\c3b48375-de51-4099-8580-47fc82f624ee\\.system_generated\\steps\\1307\\content.md', 'utf8');

// Match videoId
const matches = [...content.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)];
const uniqueIds = [...new Set(matches.map(m => m[1]))];
console.log('Found video IDs count:', uniqueIds.length);
console.log('Video IDs:', uniqueIds);

// Extract playlist items with titles
const itemMatches = [...content.matchAll(/"playlistVideoRenderer":\{"videoId":"([a-zA-Z0-9_-]{11})"[^}]+"title":\{"runs":\[\{"text":"([^"]+)"/g)];
console.log('Playlist items with titles count:', itemMatches.length);
itemMatches.forEach(m => console.log(m[1], ':', m[2]));

