const https = require('https');

https.get('https://www.youtube.com/playlist?list=PLRBXrnlfdLSo', (res) => {
  let html = '';
  res.on('data', d => html += d);
  res.on('end', () => {
    const hiddenMatch = html.match(/(\d+)\s+unavailable videos are hidden/);
    console.log('Hidden videos alert:', hiddenMatch ? hiddenMatch[0] : 'None');
    const totalMatch = html.match(/"text":"(\d+)"\},\{"text":" videos"/);
    console.log('Total videos in playlist:', totalMatch ? totalMatch[1] : 'Unknown');
    const matches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)];
    const ids = [...new Set(matches.map(m => m[1]))];
    console.log('Unique video IDs currently visible:', ids.length);
    console.log('IDs:', ids);
  });
});

