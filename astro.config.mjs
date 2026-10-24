import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const indexable = process.env.PUBLIC_INDEXABLE === 'true';
if (indexable && !process.env.SITE_URL)
  throw new Error('Indexable builds require SITE_URL.');
export default defineConfig({
  site: process.env.SITE_URL || 'https://example.invalid',
  output: 'static',
  trailingSlash: 'always',
  // One small stylesheet: inlining it removes the render-blocking request.
  build: { inlineStylesheets: 'always' },
  integrations: [react(), mdx(), ...(indexable ? [sitemap()] : [])],
  vite: { plugins: [tailwindcss()] },
});
