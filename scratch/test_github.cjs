const https = require('https');

https.get('https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/audi.png', (res) => {
  console.log('Status Code:', res.statusCode);
  res.on('data', () => {});
}).on('error', (err) => {
  console.error('Error:', err);
});
