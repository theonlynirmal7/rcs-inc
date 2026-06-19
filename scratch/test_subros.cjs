const https = require('https');

const options = {
  hostname: 'www.subros.com',
  path: '/templates/images/subros-logo.png',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

https.get(options, (res) => {
  console.log('Status Code:', res.statusCode);
  res.on('data', () => {});
}).on('error', (err) => {
  console.error('Error:', err);
});
