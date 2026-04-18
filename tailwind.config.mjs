/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 深空石板蓝 - 主背景色
        'deep-space': '#0a192f',
        // 丁火琥珀金 - 强调色
        'ding-fire': '#FBBF24',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.slate.300'),
            '--tw-prose-headings': theme('colors.slate.100'),
            '--tw-prose-links': theme('colors.amber.400'),
            '--tw-prose-bold': theme('colors.slate.100'),
            '--tw-prose-code': theme('colors.amber.400'),
            '--tw-prose-pre-bg': theme('colors.slate.800'),
            '--tw-prose-pre-code': theme('colors.slate.300'),
            '--tw-prose-quotes': theme('colors.slate.300'),
            '--tw-prose-quote-borders': theme('colors.amber.400'),
            '--tw-prose-hr': theme('colors.slate.700'),
            a: {
              textDecoration: 'none',
              '&:hover': {
                color: theme('colors.amber.300'),
                textDecoration: 'underline',
              },
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
