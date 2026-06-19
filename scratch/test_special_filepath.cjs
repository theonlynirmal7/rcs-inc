const https = require('https');
const urlModule = require('url');

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
      console.log('GET:', urlStr, '-> Status:', res.statusCode);
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const nextUrl = urlModule.resolve(urlStr, res.headers.location);
        getFinalUrl(nextUrl).then(resolve);
      } else {
        resolve({ url: urlStr, statusCode: res.statusCode, headers: res.headers });
      }
    }).on('error', (err) => {
      console.error('Error on', urlStr, ':', err);
      resolve({ url: urlStr, statusCode: 500 });
    });
  });
}

getFinalUrl('https://commons.wikimedia.org/wiki/Special:FilePath/Denso.svg').then(res => {
  console.log('Final Result:', res);
});
