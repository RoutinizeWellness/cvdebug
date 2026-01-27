import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_API = 'https://api.github.com/repos/RoutinizeWellness/cvdebug/git/trees/main?recursive=1';
const RAW_BASE = 'https://raw.githubusercontent.com/RoutinizeWellness/cvdebug/main/';

const invalidPatterns = [
  /\$/,
  /\\/,
  /[\[\]]/,
  /\)/,
  /,/,
  /\//g.test.bind(/\//g)
];

function isValidPath(filePath) {
  const invalidChars = ['\\s*', '\\w*', '```', '$/g', '/gm', '/i', '$/m', 'g,'];
  return !invalidChars.some(char => filePath.includes(char));
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        fs.unlink(destPath, () => {});
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('🔍 Fetching repository tree...');
  
  https.get(GITHUB_API, { headers: { 'User-Agent': 'Node.js' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', async () => {
      const tree = JSON.parse(data);
      const files = tree.tree.filter(item => 
        item.type === 'blob' && 
        isValidPath(item.path) &&
        !item.path.includes('node_modules') &&
        !item.path.includes('.git/')
      );

      console.log(`📦 Found ${files.length} valid files`);
      console.log('⬇️  Downloading files...\n');

      let downloaded = 0;
      let failed = 0;

      for (const file of files) {
        const url = RAW_BASE + file.path;
        const destPath = path.join(__dirname, file.path);
        
        try {
          await downloadFile(url, destPath);
          downloaded++;
          process.stdout.write(`\r✅ Downloaded: ${downloaded}/${files.length} | ❌ Failed: ${failed}`);
        } catch (err) {
          failed++;
          console.error(`\n❌ Failed: ${file.path} - ${err.message}`);
        }
      }

      console.log(`\n\n🎉 Download complete!`);
      console.log(`✅ Successfully downloaded: ${downloaded}`);
      console.log(`❌ Failed: ${failed}`);
    });
  }).on('error', (err) => {
    console.error('❌ Error fetching repository:', err.message);
  });
}

main();
