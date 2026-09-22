const fs = require('fs');

const ytVideos = [
  { id: 'NYtyuCz8fAE', title: 'Arnav Kaldate Solo Dance' },
  { id: 'cuyd2ZeLWMo', title: 'Adhira Wani Solo Dance' },
  { id: 'YqhSeoy1fjM', title: 'Trisha, Aarohi Group Dance2' },
  { id: 'itGFgGp7dAE', title: 'Trisha, Aarohi Group Dance' },
  { id: '72iRepl-JYo', title: 'Sayali Sikania Solo Dance' },
  { id: '7-2Pc7EcFcc', title: 'Vikas Dalavi Solo Dance1' },
  { id: 'nCsEuLLhulc', title: 'Vikas Dalavi Solo Dance3' },
  { id: 'w5y2OeEuBpc', title: 'Vikas Dalavi & Team Group Dance' },
  { id: 'TgcrlYDjqw0', title: 'Avani Dalavi Solo Dance' },
  { id: '0lC6kqiamNA', title: 'Kashvi Patil Solo Dance' },
  { id: 'yLRqRzjF-kI', title: 'Kashvi, Divyanka Group Dance' },
  { id: 'fQcqJAOn40s', title: 'Shambvi Pawar Solo Dance' },
  { id: 'tP62MRyEe6Q', title: 'Bhajani Mandal Ladies Group dance' },
  { id: 'dRLHFJXNd4U', title: 'Riva, Enaira, Pranshul, Pari, Tanvish, Shivansh Group Dance' }
];

const content = fs.readFileSync('frontend/src/data/driveReelsData.ts', 'utf8');

// Match items in DRIVE_FOLDER_REEL_VIDEOS
const regex = /{\s*"id":\s*"([^"]+)",\s*"driveFileId":\s*"([^"]+)",[\s\S]*?"title":\s*"([^"]+)",\s*"subtitle":\s*"([^"]+)",\s*"category":\s*"([^"]+)"/g;
let m;
const driveItems = [];
while ((m = regex.exec(content)) !== null) {
  driveItems.push({
    id: m[1],
    driveFileId: m[2],
    title: m[3],
    subtitle: m[4],
    category: m[5]
  });
}

console.log('Parsed drive items:', driveItems.length);
driveItems.forEach((d, i) => {
  console.log(`${i + 1}. [${d.driveFileId}] ${d.title} (${d.subtitle})`);
});

