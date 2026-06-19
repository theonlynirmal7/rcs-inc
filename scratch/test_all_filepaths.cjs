const https = require('https');
const urlModule = require('url');

const filenames = {
  'Mahle': 'MAHLE_logo.svg',
  'Denso': 'Denso.svg',
  'Sanden': 'Sanden_logo.svg',
  'Valeo': 'Valeo_Logo.svg',
  'Delphi': 'Delphi.svg',
  'Bitzer': 'Bitzer_Logo.svg',
  'NSK': 'NSK_logo.svg',
  'SRF': 'SRF_Limited_logo.svg',
  'Motherson': 'Motherson_Group_logo.svg',
  'Hanon': 'Logo_hanon.svg'
};

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
  for (const [brand, file] of Object.entries(filenames)) {
    const res = await getFinalUrl(`https://commons.wikimedia.org/wiki/Special:FilePath/${file}`);
    console.log(`${brand} (${file}) -> Status: ${res.statusCode}, URL: ${res.url}`);
  }
}

run();
