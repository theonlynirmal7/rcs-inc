const https = require('https');

https.get('https://logo.clearbit.com/denso.com', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  res.on('data', (d) => {
    // consume data
  });
}).on('error', (err) => {
  console.error('Error:', err);
});
