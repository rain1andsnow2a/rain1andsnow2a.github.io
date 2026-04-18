/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 星际深蓝配色体系 - 提亮版
        'navy': {
          950: '#142a56ff',  // 主背景（更亮的深蓝）
          900: '#162744',  // 稍亮背景
          800: '#1e3354',  // 卡片/内容区背景
          700: '#2e4470',  // 边框/分割线
          600: '#405a8a',  // hover 边框
        },
        // 丁火琥珀金 - 强调色
        'ding-fire': '#FBBF24',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
