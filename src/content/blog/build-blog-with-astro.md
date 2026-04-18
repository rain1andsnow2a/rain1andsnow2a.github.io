---
title: 如何用Astro搭建你的个人博客
description: 一步步教你用 Astro + Tailwind CSS + MDX 搭建一个暗色主题的个人博客，并部署到 GitHub Pages。
pubDate: '2026-04-18'
tags:
  - 技术
  - Astro
  - 教程
updatedDate: '2026-04-18'
---
## 前言 如果你想要一个 **加载飞快、SEO 友好、样式自由** 的博客，Astro 是目前最好的选择之一。

### 为什么选 Astro？ 传统的博客框架要么太重（Next.js），要么模板语法难写（Hugo），Astro 找到了一个完美的平衡点： | 特性 | Astro | Next.js | Hugo | |------|-------|---------|------| | 默认零 JS | ✅ | ❌ | ✅ | | 组件化开发 | ✅ | ✅ | ❌ | | Tailwind 集成 | ✅ | ✅ | ⚠️ | | 学习曲线 | 低 | 中 | 高 |

### 核心概念 Astro 的核心理念是 **"岛屿架构"（Islands Architecture）**：

- 页面默认输出纯 HTML —— 零 JavaScript- 需要交互的组件作为"岛屿"独立水合- 结果：页面加载速度极快 ``` ┌─────────────────────────────┐ │ 静态 HTML (零 JS) │ │ ┌───────┐ ┌──────────┐ │ │ │ 岛屿 │ │ 岛屿 │ │ │ │(交互) │ │ (交互) │ │ │ └───────┘ └──────────┘ │ └─────────────────────────────┘ ``

### `配置暗色主题`` 我们的博客采用"深空石板蓝"主题：`

- `背景: `bg-slate-900` (#0F172A)`- `文本: `text-slate-300` (#cbd5e1)`- `强调: `text-amber-400` (#FBBF24) — 丁火琥珀金```css / 选中文本也呼应主题 / ::selection { background-color: rgba(251, 191, 36, 0.2); color: #FBBF24; } ``

### `部署到 GitHub Pages`- `在 GitHub 创建仓库 `.github.io`- 添加 GitHub Actions 工作流- 推送代码，自动构建部署 就这么简单！

### 总结 Astro + Tailwind CSS + MDX + GitHub Pages = 一个 **免费、快速、美观** 的个人博客。 开始写你的第一篇文章吧 ✦
