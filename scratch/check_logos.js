const https = require('https');

const logoUrls = [
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/isuzu.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/aston-martin.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/audi.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/bentley.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/bmw.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/chevrolet.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/citroen.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/ferrari.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/ford.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/honda.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/hyundai.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/jaguar.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/jeep.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/kia.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/lamborghini.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/land-rover.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/lexus.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/maserati.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/mazda.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/mercedes-benz.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/mini.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/mitsubishi.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/nissan.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/opel.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/porsche.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/renault.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/skoda.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/suzuki.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/tesla.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/toyota.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/volkswagen.svg',
  'https://cdn.jsdelivr.net/gh/gilbarbara/logos@2022.22/logos/volvo.svg',
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
  results.forEach((r) => {
    if (r.error || r.statusCode !== 200) {
      console.log(`❌ Failed: ${r.url} - Status: ${r.statusCode || r.error}`);
    } else {
      console.log(`✅ Success: ${r.url}`);
    }
  });
});
