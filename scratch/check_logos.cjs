const https = require('https');

const logoUrls = [
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/isuzu.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/aston-martin.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/audi.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/bentley.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/bmw.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/chevrolet.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/citroen.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/ferrari.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/ford.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/honda.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/hyundai.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/jaguar.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/jeep.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/kia.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/lamborghini.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/land-rover.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/lexus.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/maserati.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/mazda.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/mercedes-benz.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/mini.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/mitsubishi.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/nissan.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/opel.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/porsche.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/renault.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/skoda.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/suzuki.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/tesla.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/toyota.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/volkswagen.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/volvo.svg',
  'https://logo.clearbit.com/bugatti.com',
  'https://logo.clearbit.com/rolls-royce.com',
  'https://logo.clearbit.com/mahindra.com',
  'https://logo.clearbit.com/tatamotors.com',
  'https://logo.clearbit.com/mgmotor.co.in'
];

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, statusCode: res.statusCode });
    }).on('error', (err) => {
      resolve({ url, error: err.message });
    });
  });
}

Promise.all(logoUrls.map(checkUrl)).then((results) => {
  let failed = 0;
  results.forEach((r) => {
    if (r.error || r.statusCode !== 200) {
      console.log(`❌ Failed: ${r.url} - Status: ${r.statusCode || r.error}`);
      failed++;
    } else {
      console.log(`✅ Success: ${r.url}`);
    }
  });
  console.log(`Summary: ${results.length - failed}/${results.length} succeeded.`);
});
