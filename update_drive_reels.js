const fs = require('fs');

const ytMapping = {
  // Arnav Kaldate Solo Dance
  '1SCxyddyEnxkpDUTiH5RqknJCE7A5vtof': {
    youtubeId: 'NYtyuCz8fAE',
    title: 'अर्णव कालदाते - सोलो डान्स',
    subtitle: 'Arnav Kaldate Solo Dance • ऊर्जावान नृत्य सादरीकरण'
  },
  // Trisha & Aarohi Group Dance Part 1
  '1NQqJMhyab64MfoffmXdFg16zLXN3LuPn': {
    youtubeId: 'itGFgGp7dAE',
    title: 'त्रिशा व आरोही - ग्रुप डान्स (भाग १)',
    subtitle: 'Trisha & Aarohi Group Dance • अप्रतिम बाल नृत्य'
  },
  // Trisha & Aarohi Group Dance Part 2
  '1izAJEaiX7goaDDR3ugb3X6BXrK5AhvzA': {
    youtubeId: 'YqhSeoy1fjM',
    title: 'त्रिशा व आरोही - ग्रुप डान्स (भाग २)',
    subtitle: 'Trisha & Aarohi Group Dance Part 2 • तालबद्ध नृत्य जल्लोष'
  },
  // Sayali Sikania Solo Dance
  '1Qwgxe8knrGdJvXsjlZjZJqs2PsiQ8a-C': {
    youtubeId: '72iRepl-JYo',
    title: 'सायली सिकानिया - सोलो डान्स',
    subtitle: 'Sayali Sikania Solo Dance • शास्त्रीय व आधुनिक नृत्य संगम'
  },
  // Vikas Dalavi Solo Dance 1
  '1YZrH4UXF5cUvrzNl9hgtDw6zPWsTeeEw': {
    youtubeId: '7-2Pc7EcFcc',
    title: 'विकास दळवी - सोलो डान्स (१)',
    subtitle: 'Vikas Dalavi Solo Dance Part 1 • हाय एनर्जी डान्स'
  },
  // Vikas Dalavi Solo Dance 3
  '19TU8axpP0WHtZ7OS34WSkmQANSXNHHKQ': {
    youtubeId: 'nCsEuLLhulc',
    title: 'विकास दळवी - सोलो डान्स (३)',
    subtitle: 'Vikas Dalavi Solo Dance Part 3 • उत्स्फूर्त नृत्य सादरीकरण'
  },
  // Vikas Dalavi & Team Group Dance
  '11bajGXS2L8TbxdzxIvDpV_vNrsbzjHrT': {
    youtubeId: 'w5y2OeEuBpc',
    title: 'विकास दळवी आणि टीम - ग्रुप डान्स',
    subtitle: 'Vikas Dalavi & Team Group Dance • तरुणाईचा जल्लोष'
  },
  // Avani Dalavi Solo Dance
  '1ZtnM3T4MiKoWEH-mOFe8F8XmeTJgUC1P': {
    youtubeId: 'TgcrlYDjqw0',
    title: 'अवनी दळवी - सोलो डान्स',
    subtitle: 'Avani Dalavi Solo Dance • सुंदर नृत्यविष्कार'
  },
  // Kashvi Patil Solo Dance
  '1cg5N3Bv4vJ263S3Nuz7OqZWInORbLEkc': {
    youtubeId: '0lC6kqiamNA',
    title: 'काश्मी पाटील - सोलो डान्स',
    subtitle: 'Kashvi Patil Solo Dance • तालबद्ध व प्रभावी नृत्य'
  },
  // Kashvi & Divyanka Group Dance
  '1RMKjmkaRtcf8xl_JXfxhP7yauAVSccD8': {
    youtubeId: 'yLRqRzjF-kI',
    title: 'काश्मी व दिव्यांका - ग्रुप डान्स',
    subtitle: 'Kashvi & Divyanka Group Dance • सुंदर जुगलबंदी नृत्य'
  },
  // Shambhavi Pawar Solo Dance
  '1Rd2VoXEQcGH6IzE4v9NAWtvNhInetPYZ': {
    youtubeId: 'fQcqJAOn40s',
    title: 'शाम्भवी पवार - सोलो डान्स',
    subtitle: 'Shambhavi Pawar Solo Dance • विलोभनीय नृत्य सादरीकरण'
  },
  // Riva, Enaira, Pranshul, Pari, Tanvish, Shivansh Group Dance
  '1tsED_ZEVRin1U-61EpLPWbh6SdY6-0pj': {
    youtubeId: 'dRLHFJXNd4U',
    title: 'रिवा, एनायरा, प्रांशुल, परी, तन्वीश, शिवांश ग्रुप डान्स',
    subtitle: 'Kids Super Group Dance • बाप्पांच्या गजरात धमाकेदार ग्रुप डान्स'
  },
  // Bhajani Mandal Ladies Group Dance
  '1mXJHna1sRAkn_uY5XJ6xrOJyedM6g41I': {
    youtubeId: 'tP62MRyEe6Q',
    title: 'भजनी मंडळ व महिला ग्रुप डान्स',
    subtitle: 'Bhajani Mandal Ladies Group Dance • प्राइड गणेशोत्सव सांस्कृतिक संध्या'
  },
  // Adhira Wani Solo Dance
  '1SOjWkK5UeMJS9SPYiRgMuok96oQemu5o': {
    youtubeId: 'cuyd2ZeLWMo',
    title: 'अधिरा वाणी - सोलो डान्स',
    subtitle: 'Adhira Wani Solo Dance • बालकलाकार सुंदर नृत्य सादरीकरण'
  }
};

let filePath = 'frontend/src/data/driveReelsData.ts';
let code = fs.readFileSync(filePath, 'utf8');

// Replace items
let updatedCount = 0;
for (const [driveId, info] of Object.entries(ytMapping)) {
  // Regex to find the block containing this driveFileId
  const regex = new RegExp(`(\\{\\s*"id":\\s*"[^"]*",\\s*"driveFileId":\\s*"${driveId}",[\\s\\S]*?"category":\\s*"[^"]*",\\s*"order":\\s*\\d+\\s*\\})`, 'g');
  
  code = code.replace(regex, (match) => {
    updatedCount++;
    // Extract existing fields
    const idMatch = match.match(/"id":\s*"([^"]+)"/);
    const categoryMatch = match.match(/"category":\s*"([^"]+)"/);
    const orderMatch = match.match(/"order":\s*(\d+)/);
    
    return `{
    "id": "${idMatch ? idMatch[1] : 'drive-reel-' + driveId}",
    "driveFileId": "${driveId}",
    "youtubeId": "${info.youtubeId}",
    "mediaType": "youtube",
    "imageUrl": "https://i.ytimg.com/vi/${info.youtubeId}/hqdefault.jpg",
    "videoUrl": "https://www.youtube.com/watch?v=${info.youtubeId}",
    "embedUrl": "https://www.youtube.com/embed/${info.youtubeId}",
    "title": "${info.title}",
    "subtitle": "${info.subtitle}",
    "category": "${categoryMatch ? categoryMatch[1] : 'नृत्य'}",
    "order": ${orderMatch ? orderMatch[1] : 10}
  }`;
  });
}

console.log(`Updated ${updatedCount} items to YouTube in driveReelsData.ts`);
fs.writeFileSync(filePath, code, 'utf8');
console.log('Saved successfully!');

