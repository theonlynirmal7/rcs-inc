const https = require('https');
const urlModule = require('url');

const filesToTest = [
  'Mahle.svg', 'Mahle_logo.svg', 'MAHLE.svg',
  'Bitzer.svg', 'Bitzer_logo.svg', 'BITZER_logo.svg',
  'NSK.svg', 'NSK_Logo.svg',
  'SRF.svg', 'SRF_logo.svg',
  'Motherson.svg', 'Motherson_logo.svg', 'Samvardhana_Motherson_Group.svg',
  'Spal.svg', 'SPAL_logo.svg', 'Spal_logo.png', 'SPAL_logo.png'
];

function getFinalUrl(urlStr) {
  return new Promise((resolve) => {
    const parsedUrl = urlModule.parse(urlStr);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      headers: {
        'User-Agent': 'RCSAutomotiveLogoDownloader/1.0 (rameswarcoolspares@gmail.com; http://rameswarcoolspares.com) Node.js/18.0'
      }
    };

    https.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const nextUrl = urlModule.resolve(urlStr, res.headers.location);
        getFinalUrl(nextUrl).then(resolve);
      } else {
        resolve({ url: urlStr, statusCode: res.statusCode });
      }
    }).on('error', (err) => {
      resolve({ url: urlStr, statusCode: 500 });
    });
  });
}

async function run() {
  for (const file of filesToTest) {
    const res = await getFinalUrl(`https://commons.wikimedia.org/wiki/Special:FilePath/${file}`);
    if (res.statusCode === 200) {
      console.log(`✅ FOUND: ${file} -> URL: ${res.url}`);
    }
  }
}

run();
