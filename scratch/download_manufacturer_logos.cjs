const fs = require('fs');
const path = require('path');
const https = require('https');
const urlModule = require('url');

const outputDir = path.join(__dirname, '../public/manufacturer-logos');

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Map of brand names to their verified Wikimedia Commons filenames
const wikimediaFiles = {
  'Mahle': 'Mahle_logo.svg',
  'Denso': 'Denso.svg',
  'Sanden': 'Sanden_logo.svg',
  'Valeo': 'Valeo_Logo.svg',
  'Delphi': 'Delphi.svg',
  'Bitzer': 'Bitzer_logo.svg',
  'NSK': 'NSK_Logo.svg',
  'SRF': 'SRF_Limited.png',
  'Motherson': 'Samvardhana_Motherson_Peguform_Logo.svg',
  'Hanon': 'Logo_hanon.svg'
};

// Map of brand names to reuse from vehicle brand logos (already hosted in public/brand-logos)
const localVehicleLogos = {
  'Toyota': 'toyota.png',
  'Lexus': 'lexus.png',
  'Honda': 'honda.png',
  'MGP (Maruti Genuine Parts)': 'suzuki.png' // Use Suzuki logo for Maruti Genuine Parts
};

function downloadUrl(urlStr, dest) {
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
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const nextUrl = urlModule.resolve(urlStr, res.headers.location);
        downloadUrl(nextUrl, dest).then(resolve);
        return;
      }

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

async function run() {
  console.log('Downloading manufacturer logos from Wikimedia Commons...');
  
  const results = [];
  
  // 1. Download Wikimedia logos
  for (const [brandName, file] of Object.entries(wikimediaFiles)) {
    const fileExt = path.extname(file);
    const filename = brandName.toLowerCase().replace(/[^a-z0-9]/g, '_') + fileExt;
    const dest = path.join(outputDir, filename);
    const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${file}`;
    
    console.log(`Downloading ${brandName} from Special:FilePath...`);
    const success = await downloadUrl(url, dest);
    results.push({ brandName, success, filename, source: 'Wikimedia' });
    
    if (success) {
      console.log(`✅ Downloaded: ${brandName}`);
    } else {
      console.log(`❌ Failed: ${brandName}`);
    }
  }

  // 2. Handle Mahle Behr as a copy of Mahle
  const mahleDest = path.join(outputDir, 'mahle.svg');
  const mahleBehrDest = path.join(outputDir, 'mahle_behr.svg');
  if (fs.existsSync(mahleDest)) {
    fs.copyFileSync(mahleDest, mahleBehrDest);
    console.log('✅ Created Mahle Behr logo (copied Mahle)');
    results.push({ brandName: 'Mahle Behr', success: true, filename: 'mahle_behr.svg', source: 'Local Copy' });
  }

  // 3. Copy local vehicle logos
  const vehicleLogosDir = path.join(__dirname, '../public/brand-logos');
  for (const [brandName, srcFile] of Object.entries(localVehicleLogos)) {
    const srcPath = path.join(vehicleLogosDir, srcFile);
    const filename = brandName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.png';
    const destPath = path.join(outputDir, filename);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied local vehicle logo for: ${brandName}`);
      results.push({ brandName, success: true, filename, source: 'Local Vehicle Logo' });
    } else {
      console.log(`❌ Missing local vehicle logo source for: ${brandName} (searched ${srcPath})`);
      results.push({ brandName, success: false, source: 'Local Vehicle Logo' });
    }
  }

  const failed = results.filter(r => !r.success);
  console.log('\n--- DOWNLOAD SUMMARY ---');
  console.log(`Successfully acquired: ${results.length - failed.length}/${results.length}`);
}

run();
