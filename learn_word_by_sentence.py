import json
import time

import requests


def AIChat(word, model, api_key):
    questions = """我是一个正在学习英文的中国人，我希望深入地学习一个词汇，并从多个维度理解它。当我给出一个词汇时，请按照以下步骤为我详细解析：

Step1: 全面定义
请提供该词汇的主要英文定义与英文定义的中文翻译。
如果该词有多个意思或用法，请确保列举所有常见的含义，并对每个含义提供具体的英文释义。

Step2: 精确的语境化例句
根据词汇的不同意思，分开列举每个意思的典型用法。
对于每个意思，提供三个具体的使用场景和例句。
在展示语境时，请结合词汇的常见搭配（Collocations），这些搭配在学习词汇时至关重要，因为它们体现了自然语言使用中的习惯搭配。
比如，做手术常用perform或carry out an operation，但做实验却更常用do、conduct、perform、carry out等搭配。
请在提供例句时，尽量选择实际使用中的例子，而不仅仅是简单的语料库搜索结果。


我给出的词汇是：%s""" % word

    # url = "https://api.openai.com/v1/chat/completions"
    # url = "https://openkey.cloud/v1/chat/completions"
    url = "https://api.bltcy.ai/v1/chat/completions"
    # url = "https://apis.bltcy.ai/v1/chat/completions"


    headers = {
        'Content-Type': 'application/json',
        # 填写OpenKEY生成的令牌/KEY，注意前面的 Bearer 要保留，并且和 KEY 中间有一个空格。
        'Authorization': 'Bearer %s' % api_key,
    }

    data = {
        "model": model,
        "messages": [{"role": "user", "content": questions}]
    }

    response = requests.post(url, headers=headers, json=data)

    return response.json()

def get_api_key():
    try:
        with open("./.env", 'r') as file:
            content = file.read()
        api_key = json.loads(content)['api_key']
        return api_key
    except Exception as e:
        raise ("读取API key失败，请把 .env_example 文件修改成 .env 文件，并修改里面的API key:", e)
        return None

def write_file(fila_name, content, model):
    try:
        with open(fila_name, 'w') as file:
            file.write("### answered by " + model + "\n")
            file.write(content)
            file.close()
        print(f"文件 {fila_name} 写入成功")
    except Exception as e:
        print(f"文件 {fila_name} 写入失败：{e}")

def getAIExplain(API_KEY):
    f = open("./aidict-web/wordtxt/CET4_core.txt", "r")
    k = 0
    api_key = API_KEY
    if api_key is None:
        api_key = get_api_key()
    model = "grok-3"
    for i in f.readlines():
        k = k + 1
        word = i.strip()
        if len(word) == 0:
            continue
        print(f"第 {k} 个单词：{word}")
        # 判断是否存在
        try:
            with open(f"./markdown_CET4CORE/{str(k) + "-" + word}.md", 'r') as file:
                print(f"文件 {str(k) + '-' + word}.md 已存在，跳过")
                continue
        except FileNotFoundError:
            pass
        try:
            response = AIChat(word, model, api_key)
            content = response['choices'][0]['message']['content']
            # 创建文件

            write_file(f"./markdown_CET4CORE/{str(k) + "-" + word}.md", content, model)
        except Exception as e:
            print(f"获取单词 {word} 的解释失败：{e}")
            time.sleep(5)



if __name__ == '__main__':
    getAIExplain(None)