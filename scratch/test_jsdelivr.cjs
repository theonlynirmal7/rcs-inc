const https = require('https');

https.get('https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/denso.svg', (res) => {
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
