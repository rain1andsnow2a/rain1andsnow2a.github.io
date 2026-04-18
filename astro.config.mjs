import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://rain1andsnow2a.github.io',
  base: '/',
  integrations: [
    mdx(),
    tailwind(),
    icon({
      include: {
        lucide: ['sparkles', 'flame', 'star', 'github', 'arrow-right', 'home', 'book-open', 'user', 'hash', 'calendar', 'refresh-cw', 'file-text', 'clock', 'eye', 'heart', 'share-2'],
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
