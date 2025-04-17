# Please install OpenAI SDK first: `pip3 install openai`
import argparse
import json
import os.path
import shutil
import time

import requests


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
    url = "https://openkey.cloud/v1/chat/completions"

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


def copy_txt_to_markdown(txt_folder, markdown_folder):
    # 确保目标文件夹存在，如果不存在就创建
    if not os.path.exists(markdown_folder):
        os.makedirs(markdown_folder)

    # 遍历txt文件夹中的所有文件
    for filename in os.listdir(txt_folder):
        # 检查文件是否是txt文件
        if filename.endswith('.txt'):
            # 构建完整的源文件路径和目标文件路径
            src_file = os.path.join(txt_folder, filename)
            dest_file = os.path.join(markdown_folder, filename.replace('.txt', '.md'))

            # 复制文件并重命名
            shutil.copy(src_file, dest_file)
            print(f"已将文件 {filename} 复制到 {dest_file}")


def copy_md_to_txt(markdown_folder, txt_folder):
    # 确保目标文件夹存在，如果不存在就创建
    if not os.path.exists(txt_folder):
        os.makedirs(txt_folder)

    # 遍历markdown文件夹中的所有文件
    for filename in os.listdir(markdown_folder):
        # 检查文件是否是md文件
        if filename.endswith('.md'):
            # 构建完整的源文件路径和目标文件路径
            src_file = os.path.join(markdown_folder, filename)
            dest_file = os.path.join(txt_folder, filename.replace('.md', '.txt'))

            # 复制文件并重命名
            shutil.copy(src_file, dest_file)
            print(f"已将文件 {filename} 复制到 {dest_file}")

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
    f = open("all_word.txt", "r")
    k = 10
    api_key = API_KEY
    if api_key is None:
        api_key = get_api_key()
    # model = "gpt-4o"
    model = "grok-3"
    for i in f.readlines():
        if k > 1:
            break
        word = i.replace("\n", "")
        try:

            if os.path.exists("./markdown/" + word + ".md",):
                # print("第" + str(k) + "个单词:" + word + " exists")
                continue
            k = k + 1
            print(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))
            print("第" + str(k) + "个单词:" + word + " start...")
            result = AIChat(word, model, api_key)
            content = result['choices'][0]['message']['content']
            write_file("./markdown/" + word + ".md", content, model)
            write_file("./txt/" + word + ".txt", content, model)

            print("第" + str(k) + "个单词:" + word + " end...")
            print("\n")
        except Exception as e:
            print("第" + str(k) + "个单词:" + word + " error:" + str(e))
            if os.path.exists("./markdown/" + word + ".md",):
                os.remove("./markdown/" + word + ".md")
            if os.path.exists("./txt/" + word + ".txt",):
                os.remove("./txt/" + word + ".txt")
            time.sleep(5)
            continue


def extract_english_words(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Extract English words (first word before any tab, space, or part-of-speech marker)
    words = []
    for line in lines:
        # Split on whitespace and take the first element
        word = line.strip().split()[0]
        # Ensure it's a valid word (contains only letters, no special characters)
        if word.isalpha():
            words.append(word)

    # Write words to output file, one per line
    with open(output_file, 'w', encoding='utf-8') as f:
        for word in words:
            f.write(word + '\n')




if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--API_KEY",
        dest="API_KEY",
        type=str,
        help="API_KEY",
    )
    options = parser.parse_args()
    API_KEY = options.API_KEY

    getAIExplain(API_KEY)




























