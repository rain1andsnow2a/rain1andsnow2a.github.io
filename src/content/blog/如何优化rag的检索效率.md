---
title: 如何优化RAG的检索效率
description: 从A社(Anthropic)博客文章中获得的收获
pubDate: '2026-04-18'
tags:
  - AI
  - RAG
updatedDate: '2026-04-19'
---
如果要给AI在某些专业的领域变得更强，一般有几种方法

1.直接训练微调模型，这个工作量和需要的算力比较大，毕竟是涉及到模型内部的参数

2.RAG

3.目前最新的一个解决方案，github项目[https://github.com/supermemoryai/supermemory,](https://github.com/supermemoryai/supermemory,它是包括了RAG，但是不止于RAG,它相当于给了AI一个非常完美的上下文环境,并且还把信息用graph)它是包括了RAG，但是不止于RAG,它相当于给了AI一个非常完美的上下文环境,并且还把信息用graph memory的方式进行存储

这里主要是介绍下RAG以及对RAG的优化

首先RAG，全称Retrieve Augment Generation，检索增强生成

最简单的理解是把用户的输入转化为向量，然后与向量数据库如Chromdb或者qdrant中的文本向量进行匹配，向量是类似于(x1,x2,x3….)这种形式的，向量的距离是通过根号下的平方相减的形式计算的，算是算三维向量距离那种计算公式的拓展，距离越近，则表示语义越相关，然后根据距离从小到大进行排序，选出top N条
