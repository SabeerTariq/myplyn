import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, '..', 'client', 'src', 'landing', 'pages');

function styleToJsx(styleStr) {
  const parts = styleStr.split(';').filter(Boolean).map((s) => {
    const idx = s.indexOf(':');
    const key = s.slice(0, idx).trim();
    const val = s.slice(idx + 1).trim();
    const jsKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    return `${jsKey}: '${val.replace(/'/g, "\\'")}'`;
  });
  return `{{ ${parts.join(', ')} }}`;
}

function fixContent(src) {
  return src
    .replace(/style="([^"]*)"/g, (_, s) => `style=${styleToJsx(s)}`)
    .replace(/stop-color=/g, 'stopColor=')
    .replace(/stop-opacity=/g, 'stopOpacity=')
    .replace(/to="\/auth\/signup" className="btn btn-white/g, 'to="/auth/signup/advertiser" className="btn btn-white')
    .replace(/to="\/auth\/signup" className="btn btn-primary btn-lg">Start a campaign/g, 'to="/auth/signup/advertiser" className="btn btn-primary btn-lg">Start a campaign')
    .replace(/to="\/auth\/signup" className="btn btn-primary btn-block">Start a campaign/g, 'to="/auth/signup/advertiser" className="btn btn-primary btn-block">Start a campaign')
    .replace(/to="\/auth\/signup" className="btn btn-primary btn-lg"><span/g, 'to="/auth/signup/advertiser" className="btn btn-primary btn-lg"><span')
    .replace(/to="\/auth\/signup" className="btn btn-accent/g, 'to="/auth/signup/creator" className="btn btn-accent');
}

for (const file of fs.readdirSync(pagesDir)) {
  if (!file.endsWith('.jsx')) continue;
  const p = path.join(pagesDir, file);
  fs.writeFileSync(p, fixContent(fs.readFileSync(p, 'utf8')));
  console.log('Fixed', file);
}
