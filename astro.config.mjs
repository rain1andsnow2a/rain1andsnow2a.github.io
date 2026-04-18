import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://rain1andsnow2a.github.io',
  base: '/',
  integrations: [
    preact({
      reactAliases: true,
    }),
    mdx(),
    tailwind(),
    icon({
      include: {
        lucide: ['sparkles', 'flame', 'star', 'github', 'arrow-right', 'home', 'book-open', 'user'],
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
