import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const branch = process.env.VITE_AMP_ENV || 'dev';

let content = `User-agent: *\nDisallow: /`;

if (branch === 'prod') {
  content = `User-agent: *\nAllow: /`;
}

fs.writeFileSync(path.join(__dirname, '..', '..', 'public', 'robots.txt'), content, 'utf8');

console.log(`robots.txt generado para la rama: ${branch}`);
