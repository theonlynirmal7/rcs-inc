const fs = require('fs');
const path = require('path');
const https = require('https');

const outputDir = path.join(__dirname, '../public/brand-logos');

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Brand mapping with their filename fallbacks in filippofilip95/car-logos-dataset
const brands = {
  'isuzu': ['isuzu'],
  'aston-martin': ['aston-martin', 'astonmartin'],
  'audi': ['audi'],
  'bentley': ['bentley'],
  'bmw': ['bmw'],
  'chevrolet': ['chevrolet'],
  'citroen': ['citroen'],
  'ferrari': ['ferrari'],
  'ford': ['ford'],
  'honda': ['honda'],
  'hyundai': ['hyundai'],
  'jaguar': ['jaguar'],
  'jeep': ['jeep'],
  'kia': ['kia'],
  'lamborghini': ['lamborghini'],
  'land-rover': ['land-rover', 'landrover'],
  'lexus': ['lexus'],
  'maserati': ['maserati'],
  'mazda': ['mazda'],
  'mercedes-benz': ['mercedes-benz', 'mercedes', 'mercedesbenz'],
  'mini': ['mini'],
  'mitsubishi': ['mitsubishi'],
  'nissan': ['nissan'],
  'opel': ['opel'],
  'porsche': ['porsche'],
  'renault': ['renault'],
  'skoda': ['skoda'],
  'suzuki': ['suzuki', 'maruti-suzuki', 'maruti'], // Suzuki logo for Maruti Suzuki
  'tesla': ['tesla'],
  'toyota': ['toyota'],
  'volkswagen': ['volkswagen'],
  'volvo': ['volvo'],
  'bugatti': ['bugatti'],
  'rolls-royce': ['rolls-royce', 'rollsroyce'],
  'mahindra': ['mahindra'],
  'tata': ['tata', 'tata-motors'], 
  'mg': ['mg', 'morris-garages', 'mg-motor'] 
};

function downloadUrl(url, dest) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(dest);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
      } else {
        resolve(false);
      }
    }).on('error', (err) => {
      resolve(false);
    });
  });
}

async function downloadBrand(brandKey, fileNames) {
  const dest = path.join(outputDir, `${brandKey}.png`);
  
  for (const fileName of fileNames) {
    const url = `https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/${fileName}.png`;
    const success = await downloadUrl(url, dest);
    if (success) {
      return { brandKey, success: true, url };
    }
  }
  
  return { brandKey, success: false };
}

async function run() {
  console.log('Starting downloads...');
  
  const results = [];
  for (const [key, files] of Object.entries(brands)) {
    const res = await downloadBrand(key, files);
    results.push(res);
    if (res.success) {
      console.log(`✅ Downloaded: ${key}`);
    } else {
      console.log(`❌ Failed: ${key}`);
    }
  }

  const failed = results.filter(r => !r.success);
  console.log('\n--- DOWNLOAD SUMMARY ---');
  console.log(`Successfully downloaded: ${results.length - failed.length}/${results.length}`);
  
  if (failed.length > 0) {
    console.log('\nFailed brands:');
    failed.forEach(f => {
      console.log(`- ${f.brandKey}`);
    });
  }
}

run();
