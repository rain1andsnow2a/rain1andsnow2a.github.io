---
title: 如何优化RAG的检索效率
description: 从A社(Anthropic)博客文章中获得的收获
pubDate: '2026-04-18'
tags:
  - AI
  - RAG
updatedDate: '2026-04-20'
---
如果要给AI在某些专业的领域变得更强，一般有几种方法

1.直接训练微调模型，这个工作量和需要的算力比较大，毕竟是涉及到模型内部的参数

2.RAG

3.目前最新的一个解决方案，github项目[https://github.com/supermemoryai/supermemory,](https://github.com/supermemoryai/supermemory,它是包括了RAG，但是不止于RAG,它相当于给了AI一个非常完美的上下文环境,并且还把信息用graph)它是包括了RAG，但是不止于RAG,它相当于给了AI一个非常完美的上下文环境,并且还把信息用graph memory的方式进行存储

这里主要是介绍下RAG以及对RAG的优化。

首先RAG，全称Retrieve Augment Generation，检索增强生成。

最简单的理解是把用户的输入转化为向量，然后与向量数据库如Chromdb或者qdrant中的文本向量进行匹配，向量是类似于(x1,x2,x3….)这种形式的，向量的距离有的时候会用常见的欧式距离，如下面的公式，但更多的是余弦相似度和点积的方式运算。

$\sqrt{(x1-x2)^2 + (y1 - y2)^2 + (z1-z2)^2+...}$

算是三维向量距离那种计算公式的拓展，距离越近，则表示语义越相关，然后根据距离从小到大进行排序，选出top N条。

但如果更细一点理解呢，为什么是变成向量呢？

首先一段文本，如输入what's your name，会被分词器tokenizer切成一个个token，然后每个token又会变成一个token id，如：

```
what's -> 30

your -> 70

name -> 65
```

但这里的token id，它其实只是一个索引罢了。

比如your这里对应的token id是70，表示的是去embedding表中取第70行向量

$E \in {R}^{V \times D}$

其中V指的是vocabulary size，即词表大小，可以理解成这个embedding表有多少个token，即多少行

D的话是指的是向量维度，即对应的向量有多少个数字

上面your对应的token\\\_id为70，那么就是找第70行的向量，以此类推，所以本质上token\\\_id就是一个索引罢了。

经过查表这个过程得到初始向量，但还需要经过一些数学运算，才能变成带有上下文attention的向量

不过如果只靠token\\\_id查表的话，其实模型本身是不知道token之间的顺序的，所以如果没有位置标记，自来水和水来自对模型来说就是完全一样的输入，所以就有了另一个东西position\\\_id。

即位置编码

所以第i个位置的token向量，更接近于token向量+位置向量

$x_i = token\_embedding(token_i) + position_embedding(i)$

这里的i表示的是第几个向量，即向量位置

在经过Transformer编码得到上下文化的token表示：

$h_1,h_2,h_3...$（这里的每个h是第i个词在整个语境中的表示）

最后是要经过Pooling，Pooling相当于是聚合的意思，把很多个token向量压缩成一个整体向量，最简单的Pooling方法是Mean Pooling，即对所有的token向量求平均。

$v = \frac{1}{n} \times \sum_{i=1}^{n} h_i$

当然现在大模型一般用的都是更高级点的方法，通过这样的方式我们就得到了$v_q$，即query的向量表示。

通过类似的方式，我们也能得到文本chunk的向量表示$v_i$，然后进行向量的距离运算。

那这是一般的RAG，但是如何对RAG进行优化呢？

A社，Anthropic就提出了一个概念，Contextual retrieve，即上下文检索，这篇文章主要就是讲述的这种优化方式。

想要知道如何优化就先要知道RAG的不足，比如RAG虽然能进行语义上的理解，但很难把握住一些精准的字符串，如错误码TS-999这种，或者类名，表明，API路径是啥，这些需要精确命中的东西。

先介绍一个算法TF-TDF

TF：Term Frequency，词频，指的是某个词在某篇chunk出现的越多，越重要

IDF：Inverse Document Frequency，逆文档频率，这个相当于是反过来，在这个chunk里常见，但在全文档中更少见的词，更有价值

而BM25则是这个算法的改进

对于一个query q和一个chunk D,BM25经常写成如下的公式：

$BM25(q,D) = \sum_{t \in q} IDF(t) \cdot \frac{f(t,D) \cdot (k_1+1)}{f(t,D) + k_1 \cdot \left(1-b+b \cdot \frac{|D|}{avgdl}\right)}$

$t \in q$表示的是query里的每个词

-   q：query，用户查询
    
-   D：某个文档或某个 chunk
    
-   t：query 里的某个词
    
-   f(t,D)：词 ttt 在文档 DDD 里出现了几次
    
-   ∣D∣：文档 D的长度
    
-   avgdl：整个语料库中文档平均长度
    
-   k1和b：两个超参数，是事先人为设计好的
    

首先这里的求和，不是对IDF(t)进行的求和，而是对后面整体进行的求和，而后面的整体是词t对文档D的得分，这些词对当前chunk各加多少分，最后求和，通过这个可以知道命中的词越多，当前chunk的分数就越高。

这里的IDF(t)逆文档频率相当于词本身有多值钱，后面的分式则是这个词在当前文档中的匹配强度

**词项得分=词的重要性×这个词在当前文档里的匹配强度**

**一.IDF（t）**

衡量这个词在语料库中稀有不稀有

比如：

-   “the”“is”“系统”“问题” 这种词，到处都有，IDF 低
    
-   “TS-999”“PostgreSQL”“LoRA” 这种词，更稀有，IDF 高
    

IDF的常见形式是：

$IDF(t) = \log(\frac{N-n_t+0.5}{n_t+0.5}+1)$

-   N：语料库总文档数
    
-   nt​：包含词 t 的文档数  
    

如果nt很大，说明这个词很多文档都有，那IDF小

如果nt很小，说明这个词很稀有，那IDF大

**二.分式项**

### 2.1 f(t,D)词频

表示词t在文档D中的出现频率

如某个query词是Z

在某个chunk中出现了3次

那么f(z,D) = 3

但实际上这里的词频不是线性增长的，有一个饱和机制，词频越大，分数仍然增加，但越来越慢

### 2.2 看整个分子f(t,D)($E \in {R}^{V \times D}$0+1)

这里的确是直接相乘，但如果等等看分母就知道了，k1这里相当于是调节饱和曲线的参数，通常在1.2到2.0左右
