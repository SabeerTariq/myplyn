import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const landingDir = path.join(root, 'landing-page');
const outDir = path.join(root, 'client', 'src', 'landing', 'pages');

function htmlToJsx(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\bclass=/g, 'className=')
    .replace(/\bstroke-width=/g, 'strokeWidth=')
    .replace(/\bstroke-linecap=/g, 'strokeLinecap=')
    .replace(/\bstroke-linejoin=/g, 'strokeLinejoin=')
    .replace(/\bfill-rule=/g, 'fillRule=')
    .replace(/\bclip-rule=/g, 'clipRule=')
    .replace(/\bfor=/g, 'htmlFor=')
    .replace(/\btabindex=/g, 'tabIndex=')
    .replace(/\breadonly\b/g, 'readOnly')
    .replace(/\bautocomplete=/g, 'autoComplete=')
    .replace(/\bmaxlength=/g, 'maxLength=')
    .replace(/<br>/g, '<br />')
    .replace(/<img([^>]*?)(?<!\/)>/g, '<img$1 />')
    .replace(/<input([^>]*?)(?<!\/)>/g, '<input$1 />')
    .replace(/<meta([^>]*?)(?<!\/)>/g, '<meta$1 />')
    .replace(/<link([^>]*?)(?<!\/)>/g, '<link$1 />')
    .replace(/<hr([^>]*?)(?<!\/)>/g, '<hr$1 />')
    .replace(/CollabCircle/g, '{BRAND.name}')
    .replace(/collabcircle\.com/g, '{BRAND.domain}')
    .replace(/href="\.\/index\.html#([^"]+)"/g, 'href="/#$1"')
    .replace(/href="\.\/index\.html"/g, 'href="/"')
    .replace(/href="\.\/how-it-works\.html"/g, 'href="/how-it-works"')
    .replace(/href="\.\/pricing\.html"/g, 'href="/pricing"')
    .replace(/href="\.\/about\.html"/g, 'href="/about"')
    .replace(/href="\.\/contact\.html"/g, 'href="/contact"')
    .replace(/href="#"/g, 'HREF_SIGNUP_PLACEHOLDER')
    .replace(/<a /g, '<Link ')
    .replace(/<\/a>/g, '</Link>')
    .replace(/HREF_SIGNUP_PLACEHOLDER/g, 'to="/auth/signup"')
    .replace(/href="\/how-it-works"/g, 'to="/how-it-works"')
    .replace(/href="\/pricing"/g, 'to="/pricing"')
    .replace(/href="\/about"/g, 'to="/about"')
    .replace(/href="\/contact"/g, 'to="/contact"')
    .replace(/href="\/terms"/g, 'to="/terms"')
    .replace(/href="\/privacy"/g, 'to="/privacy"')
    .replace(/href="\/#([^"]+)"/g, 'to="/#$1"')
    .replace(/href="\/"/g, 'to="/"')
    .replace(/href="\/auth\/signup\/advertiser"/g, 'to="/auth/signup/advertiser"')
    .replace(/href="\/auth\/signup\/creator"/g, 'to="/auth/signup/creator"')
    .replace(/href="\/auth\/signup"/g, 'to="/auth/signup"')
    .replace(/href="\/auth\/login"/g, 'to="/auth/login"')
    .replace(/onsubmit="return false"/g, 'onSubmit={(e) => e.preventDefault()}');
}

function extractBodyContent(file) {
  const html = fs.readFileSync(file, 'utf8');
  const body = html.match(/<body>([\s\S]*)<\/body>/i)?.[1] || '';
  const withoutNav = body
    .replace(/<header class="nav">[\s\S]*?<\/header>/i, '')
    .replace(/<div class="mobile-menu">[\s\S]*?<\/div>/i, '')
    .replace(/<footer class="footer">[\s\S]*?<\/footer>/i, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '');
  return withoutNav.trim();
}

const pages = {
  'LandingHome.jsx': 'index.html',
  'LandingHowItWorks.jsx': 'how-it-works.html',
  'LandingPricing.jsx': 'pricing.html',
  'LandingAbout.jsx': 'about.html',
  'LandingContact.jsx': 'contact.html',
};

fs.mkdirSync(outDir, { recursive: true });

for (const [outFile, inFile] of Object.entries(pages)) {
  const content = extractBodyContent(path.join(landingDir, inFile));
  const jsx = htmlToJsx(content);
  const name = outFile.replace('.jsx', '');
  const wrapped = `import { Link } from 'react-router-dom';
import { BRAND } from '../../config/brand';

export default function ${name}() {
  return (
    <>
${jsx.split('\n').map((l) => (l ? `      ${l}` : '')).join('\n')}
    </>
  );
}
`;
  fs.writeFileSync(path.join(outDir, outFile), wrapped);
  console.log('Wrote', outFile);
}
