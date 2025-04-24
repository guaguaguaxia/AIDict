# Please install OpenAI SDK first: `pip3 install openai`
import argparse
import glob
import json
import os.path
import shutil
import time

import requests
import yaml


def AIChat(word, model, api_key):
    questions = """我是一个正在学习英文的中国人，我希望深入地学习一个词汇，并从多个维度理解它。当我给出一个词汇时，请按照以下步骤为我详细解析：

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

我给出的词汇是：%s""" % word

    # url = "https://api.openai.com/v1/chat/completions"
    url = "https://openkey.red/v1/chat/completions"
    # url = "https://api.bltcy.ai/v1/chat/completions"
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

def word_exists(word):
    base_folder = "./aidict-web/markdown_yml"
    file_name = base_folder + "/exists_txt_file.txt"
    # 判断单词是否存在
    if os.path.exists(file_name):
        with open(file_name, 'r') as f:
            lines = f.readlines()
            for line in lines:
                if line.strip() == word:
                    return True
    return False


def get_exists_txt_file():
    base_folder = "./aidict-web/markdown_yml"
    # 获取当前目录下所有的yml文件
    yml_files = glob.glob(os.path.join(base_folder, "*.yml"))
    # 遍历每个yml文件
    file_name = base_folder + "/exists_txt_file.txt"
    # 如果文件存在，删除它
    if os.path.exists(file_name):
        os.remove(file_name)
    for yml_file in yml_files:
        # 生成所有已经存在的单词的txt文件
        with open(file_name, 'a') as f:
            with open(yml_file, 'r') as yml:
                data = yaml.safe_load(yml)
                for item in data:
                    if isinstance(item, dict) and item.get("word"):
                        f.write(item.get("word") + "\n")


def getAIExplain(API_KEY, file_txt_name):
    if file_txt_name is None:
        file_txt_name = "all_word.txt"

    f = open(file_txt_name, "r")
    k = 1
    api_key = API_KEY
    if api_key is None:
        api_key = get_api_key()
    # model = "gpt-4o"
    model = "grok-3"
    base_folder = "./aidict-web/markdown_yml"
    get_exists_txt_file()
    for i in f.readlines():
        if k > 10:
            break
        word = i.strip()
        if not word:
            continue
        first_letter = word[0].lower()  # 获取单词首字母并转换为小写
        yml_file_path = os.path.join(base_folder, f"{first_letter}.yml")
        exists = word_exists(word)
        if exists:
            print(f"单词 {word} 已存在于文件 {yml_file_path} 中，跳过处理。")
            continue
        try:
            print(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))
            print(f"第{k}个单词: {word} start...")

            # 确保目标文件夹存在
            yml_folder = os.path.dirname(yml_file_path)
            if not os.path.exists(yml_folder):
                os.makedirs(yml_folder)

            # 调用 AIChat 获取单词解析结果
            result = AIChat(word, model, api_key)
            print(result)
            content = result['choices'][0]['message']['content']

            data = [
                {"word": word, "content": content}
            ]
            # 将结果写入对应的 YML 文件
            with open(yml_file_path, 'a') as yml_file:
                yaml.dump(data, yml_file, allow_unicode=True, default_flow_style=False)

            print(f"第{k}个单词: {word} end...\n")
            k += 1
        except Exception as e:
            print(f"第{k}个单词: {word} error: {e}")
            time.sleep(5)
            continue

# 写一个all_word.txt去重的函数
def remove_duplicates(input_file, output_file):
    # 大小写不敏感去重
    seen = set()
    with open(input_file, 'r') as infile:
        for line in infile:
            # 将行转换为小写并去除空格
            normalized_line = line.strip().lower()
            if normalized_line not in seen:
                seen.add(normalized_line)
                with open(output_file, 'a') as outfile:
                    outfile.write(line)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--API_KEY",
        dest="API_KEY",
        type=str,
        help="API_KEY",
    )

    parser.add_argument(
        "--FILETXTNAME",
        dest="FILETXTNAME",
        type=str,
        help="FILETXTNAME",
    )

    options = parser.parse_args()
    API_KEY = options.API_KEY
    FILETXTNAME = options.FILETXTNAME

    getAIExplain("sk-xYjSTR4bSd3sUSb6478542AcC7Df4964A2Db867cB81d1d3c", FILETXTNAME)
    # get_exists_txt_file()
    # remove_duplicates("./aidict-web/all_word.txt", "./aidict-web/all_word.txt")


























