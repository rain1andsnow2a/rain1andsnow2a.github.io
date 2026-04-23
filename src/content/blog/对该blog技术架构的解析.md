---
title: 对该blog技术架构的解析
description: ''
pubDate: '2026-04-22'
category: 博客搭建
tags:
  - blog
  - 架构原理分析
updatedDate: '2026-04-22'
---
这篇博客主要使用的是Astro来构建的，并且在本地使用了一个可以随时把内容上传同步至github的编辑器，模仿notion风格，而不是直接改原始的md文档。

**博客网站本身**

## 1.Astro

先说下Astro，这是一个现代化的静态网站生成器框架，用于构建博客，文档站，解决的痛点是如果使用vue或react来写网站，浏览器往往要下载一堆的js文件，导致网页打开速度变慢。

而Astro是默认零js，在服务器上把页面拼好，直接把纯HTML发给浏览器，这样用户可以直接看到内容不用等js加载

如果网站里有交互组件需要js，Astro允许你只让这部分的js加载，其它界面仍然是html

## 2.Preact

React虽然功能很强大，但对很多网站来说太重了，如果只是写几个交互组件，那就很不划算，Preact就解决了这个问题，它的特点：

- 极度轻量：React一般是40kb，而Preact只有3kb，基本不会增加页面负担，并且API和React几乎是一模一样，与React的生态库也几乎完美兼容

## 2.TailwindCSS

传统的CSS需要单独开一个文件来写样式，但TailwindCSS不一样，并不是提供了更多新样式，而是提供了一种不同的写CSS的方式

**1.传统CSS**

是如下这样写的，叫语义化类名

```
.btn-primary {
  background-color: blue;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: bold;
}
```

这种方式的痛点：

1.起名困难，要绞尽脑汁想名字（`btn-primary`? `submit-button`? `blue-btn`?），项目大了之后，命名极其痛苦。

2.文件跳来跳去，一会写html，一会写CSS

3.同名样式容易冲突

**2.TailwindCSS**

核心理念是原子化CSS，把所有的 CSS 属性拆成了最细小的颗粒，直接在 HTML 里把这些拼起来就行。

不需要写任何CSS！

如

```
<button class="bg-blue-500 text-white py-2 px-4 rounded font-bold">提交</button>
```

tailwind有很多预定义好的工具类：

- `bg-blue-500` = `background-color: blue;` （500 是深浅度）
- `text-white` = `color: white;`
- `py-2` = `padding-top: 0.5rem; padding-bottom: 0.5rem;` （上下内边距）
- `px-4` = `padding-left: 1rem; padding-right: 1rem;` （左右内边距）
- `rounded` = `border-radius: 0.25rem;` （圆角）
- `font-bold` = `font-weight: bold;` （加粗）

把CSS属性封装成了简写的类名，直接写在html标签上

**本地编辑器**

## 3.Tiptab

是一个headless，即无头的富文本编辑器框架，那什么是无头呢，那就先看下有头

### 3.1.有头

逻辑与页面是焊死的，怎么运作和长什么样硬编码到一起不可分割，引用了无法改它的外观，很多老网站的编辑器好像就是用的这种有头很丑的，记得之前打CTF的时候好像遇到过几次，但不知道叫啥名

### 3.2.headless无头

只提供核心的运转逻辑，不提供UI，你想让它长什么样，它就可以是什么样，只有灵魂，躯壳需要你自己造一个，如这里的Tiptab编辑器

## 4.MDX

传统的markdown只能写死内容，不能放交互逻辑，如按钮，动态图表

而MDX=Markdown+React组件，文件后缀是.mdx

不仅能看到文字，还能点播音乐，还能点点赞按钮...
像很多的交互式教程好像就是这么搞的

## 5.网页托管


我这里用的是Github Pages，老牌的托管神器
不过还有其它可以托管的平台
1.Vercel
Next.js 框架背后的商业公司开的托管平台，也是目前全球最火的前端部署平台。
免费额度：个人项目完全够用（Hobby 计划永久免费，带宽 100GB/月）。
2.Cloudflare Pages

全球最大的 CDN 厂商 Cloudflare 推出的托管服务。
免费额度：极其恐怖的无限量（无限带宽、无限请求次数！这是 Vercel/Netlify 比不了的）。
特点：因为 Cloudflare 本身就是做 CDN 的，所以它部署的网站在全球（包括国内）的访问速度极快，且完全不怕被流量打爆。它还集成了 Cloudflare Workers，可以在边缘节点跑 JS 逻辑。
适用：对速度要求极高、可能有大流量的博客。


## 
6.Electron


一个可以用前端技术开发桌面端app的框架，用前端技术栈就能做桌面应用，本地的博客编辑器就是这种，但缺点也有
一般比较吃内存
包体通常偏大
性能通常不如原生桌面应用那么轻

7.Katex
Latex是一个可以用代码写文档排版，以及数学公式的系统，主要的用途是写数学公式，尤其是复杂公式，如分式，上下标，微积分等
而Katex是一个开源的前端库，用来在网页上把用latex语法写的数学公式渲染出来，如

$\int_0^1 x^2 dx$



