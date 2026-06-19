const https = require('https');

const options = {
  hostname: 'upload.wikimedia.org',
  path: '/wikipedia/commons/e/ee/Denso.svg',
  headers: {
    'User-Agent': 'RCSAutomotiveLogoDownloader/1.0 (rameswarcoolspares@gmail.com; http://rameswarcoolspares.com) Node.js/18.0'
  }
};

https.get(options, (res) => {
  console.log('Status Code:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Content Length:', data.length);
    if (data.length > 0) {
      console.log('First 100 chars:', data.substring(0, 100));
    }
  });
}).on('error', (err) => {
  console.error('Error:', err);
});
