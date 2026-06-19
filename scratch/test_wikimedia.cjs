const https = require('https');

https.get('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Denso_logo.svg/500px-Denso_logo.svg.png', (res) => {
  console.log('Status Code:', res.statusCode);
  res.on('data', () => {});
}).on('error', (err) => {
  console.error('Error:', err);
});
