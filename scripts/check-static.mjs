import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
try {
  process.loadEnvFile?.();
} catch {}
const indexable = process.env.PUBLIC_INDEXABLE === 'true';
const files = await readdir('dist', { recursive: true });
const htmlFiles = files.filter((file) => file.endsWith('.html'));
assert(
  htmlFiles.length >= 35,
  'Expected site, 12 tools and 7 bilingual guides',
);
for (const page of [
  'blog/index.html',
  'vi/blog/index.html',
  'blog/unix-cron-basics/index.html',
  'vi/blog/unix-cron-basics/index.html',
  ...[
    'yaml-json-converter',
    'jwt-decoder',
    'storage-unit-converter',
    'hash-checksum',
  ].map((slug) => `tools/${slug}/index.html`),
  ...[
    'yaml-json-conversion',
    'jwt-claims-without-verification',
    'storage-units-gb-gib',
    'verify-file-checksum',
  ].flatMap((slug) => [
    `blog/${slug}/index.html`,
    `vi/blog/${slug}/index.html`,
  ]),
])
  assert(files.includes(page), `Missing guide page ${page}`);
for (const file of htmlFiles) {
  const html = await readFile(`dist/${file}`, 'utf8');
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${file}: one H1`);
  assert.match(
    html,
    /<meta name="description" content="[^"]+"/,
    `${file}: description`,
  );
  if (!indexable || file === '404.html')
    assert.match(html, /content="noindex,follow"/, `${file}: noindex`);
  else {
    assert.match(html, /rel="canonical"/, `${file}: canonical`);
    assert(!html.includes('https://example.invalid'), `${file}: real site URL`);
  }
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const path =
      href === '/'
        ? 'index.html'
        : href.endsWith('/')
          ? `${href.slice(1)}index.html`
          : href.slice(1);
    assert(files.includes(path), `${file}: broken link ${href}`);
  }
}
const robots = await readFile('dist/robots.txt', 'utf8');
assert(robots.includes(indexable ? 'Allow: /' : 'Disallow: /'));
assert.equal(files.includes('sitemap-index.xml'), indexable);
console.log(
  `Static checks passed: ${htmlFiles.length} pages; indexable=${indexable}.`,
);
