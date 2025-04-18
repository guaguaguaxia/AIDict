---



# [AIDICT](https://www.aidict.us/)

这是一个通过请求 AI API (GPT-4o、Grok-3等) 来获取英文单词详细解释的 Python 项目。该项目会将返回的单词解释保存到 `txt` 或 `markdown` 文件夹中。
试了几个流行的 AI API，最后发现 Grok-3 效果最好
## 功能

- 使用 AI API 请求给定英文单词的详细解释。
- 将解释内容保存为 `.txt` 或 `.md` 文件，方便查看和管理。
- 本地想自己跑的，可以通过修改 `.env_example` 为 `.env` 来配置 API 密钥。

## 目录结构

```
.
├── .env_example          # API 密钥配置模板文件
├── main.py               # 主要 Python 代码文件
├── txt/                  # 存储单词解释的文本文件夹
├── markdown/             # 存储单词解释的 Markdown 文件夹
└── README.md             # 项目的说明文件
```

## Prompt
```
我是一个正在学习英文的中国人，我希望深入地学习一个词汇，并从多个维度理解它。当我给出一个词汇时，请按照以下步骤为我详细解析：

Step1: 全面定义
提供该词汇的读音。如果在不同国家读音不同，请分别列出。
请提供该词汇的主要英文定义与英文定义的中文翻译。
如果该词有多个意思或用法，请确保列举所有常见的含义，并对每个含义提供具体的英文释义。

Step2: 精确的语境化例句
根据词汇的不同意思，分开列举每个意思的典型用法。
对于每个意思，提供具体的使用场景和例句。

Step3: 词汇的亲属
列出与此词汇紧密相关的同义词、反义词、派生词和复合词。
对于每个相关词汇，提供一个简短的描述或例句，重点放在这些词汇在实际使用中的搭配和语境。
对于同义词，着重给出和原词有什么区别

Step4: 词源探索
描述该词汇的词源，包括它是如何演变成现在的形式的。
如果该词汇与其他语言有关联，也请提及。

Step5: 文化和历史背景
描述这个词汇在历史、文化或社会背景中的重要性和用法。
如果可能，提供一两个著名的引用或事件，其中使用了这个词汇。

Step6: 互动式应用
创建一个与我可能的兴趣或经验相关的小故事或场景，让我在其中使用或应用这个词汇。
提供一个与此词汇相关的挑战或问题，鼓励我思考和应用。

Step7: 扩展与深化
如果这个词汇与特定的学术领域、艺术作品或流行文化有关，请给出详细的信息。
推荐几个可以进一步探索该词汇的资源，如书籍、文章、电影或音乐。

Step8: 个性化建议
基于我的学习历程或以前与您的互动，为我提供一些建议，帮助我更好地理解和记住这个词汇。

附加说明：
请确保您的回答既详细又有条理，说明和讲解用中文，以帮助我从多个角度全面地了解和掌握这个词汇。
在列举词汇定义时，请参考柯林斯词典和韦氏词典的英文解释。柯林斯词典的解释能够更好地帮助我理解词汇的使用场景，而韦氏词典的定义则更适用于GRE等考试。
在展示语境时，请结合词汇的常见搭配（Collocations），这些搭配在学习词汇时至关重要，因为它们体现了自然语言使用中的习惯搭配。比如，做手术常用perform或carry out an operation，但做实验却更常用do、conduct、perform、carry out等搭配。
请在提供例句时，尽量选择实际使用中的例子，而不仅仅是简单的语料库搜索结果。

我给出的词汇是：%s
```



