---
title: 如何用Astro搭建你的个人博客
description: 一步步教你用 Astro + Tailwind CSS + MDX 搭建一个暗色主题的个人博客，并部署到 GitHub Pages。
pubDate: '2026-04-18'
category: 博客搭建
tags:
  - 技术
  - Astro
  - 教程
updatedDate: '2026-04-18'
---
## 前言

如果你想要一个 **加载飞快、SEO 友好、样式自由** 的博客，Astro 是目前最好的选择之一。

### 为什么选 Astro？

传统的博客框架要么太重（Next.js），要么模板语法难写（Hugo），Astro 找到了一个完美的平衡点：

如果使用 React 或 Vue 来开发的话，默认会加载很多的 JS，进而降低网页的运行效率，而 Astro 是默认零 JS，页面加载速度极快。

当然，默认零 JS 并不是没有 JS，假如你有一个很酷的交互组件，Astro 允许你只让这个组件的 JS 加载。

### 部署到 GitHub Pages

该网站使用 GLM5.1 进行开发，使用 GitHub MCP 进行部署到 GitHub Pages，不过需要在设置界面添加 GitHub Action 工作流，下面只需要推送代码就可以自动创建部署，就这么简单！

### 总结

Astro + Tailwind CSS + MDX + GitHub Pages = 一个 **免费、快速、美观** 的个人博客。

开始写你的第一篇文章吧 ✦
