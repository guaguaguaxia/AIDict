import argparse
import base64
import csv
import glob
import hashlib
import os
import time

import requests


from tencentcloud.tts.v20190823 import tts_client, models
import json
from tencentcloud.common import credential
from tencentcloud.common.profile.client_profile import ClientProfile
from tencentcloud.common.profile.http_profile import HttpProfile
from tencentcloud.common.exception.tencent_cloud_sdk_exception import TencentCloudSDKException
from tencentcloud.aai.v20180522 import aai_client, models

def remove_first_last_lines(folder_path, extensions=None):
    """
    删除指定文件夹中所有文本文件的第一行和最后一行

    Args:
        folder_path: 文件夹路径
        extensions: 要处理的文本文件扩展名列表，如 ['.txt', '.md']，默认为所有 .txt 文件
    """
    if extensions is None:
        extensions = ['.json']

    # 获取所有符合扩展名的文件
    all_files = []
    for ext in extensions:
        all_files.extend(glob.glob(os.path.join(folder_path, f"*{ext}")))

    processed_count = 0
    for file_path in all_files:
        try:
            # 读取文件所有行
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()

            # 如果文件至少有3行，删除第一行和最后一行
            if len(lines) >= 3:
                if not lines[0].__contains__("json"):
                    continue
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.writelines(lines[1:-1])
                processed_count += 1
            else:
                print(f"文件 {file_path} 行数不足，保持原样")

        except Exception as e:
            print(f"处理文件 {file_path} 时出错: {str(e)}")

    print(f"处理完成，共修改了 {processed_count} 个文件")
def AIChat(word, model, api_key):
    questions = """我是一个正在学习英文的中国人，我希望深入地学习一个词汇，并从多个维度理解它。请按照以下要求为我详细解析这个词汇，并以JSON格式返回结果。

词汇：%s

请返回以下JSON格式的结果：

{
  "word": "输入的单词",
  "definitions": [
    {
      "meaning": "含义1",
      "usage": "用法描述1",
      "collocations": ["常见搭配1", "常见搭配2", "常见搭配3",....],
      "examples": [
        {
          "scene": "详细的中文场景描述1",
          "chineseIdea": "详细的中文想法1",
          "sentenceWithBlank": "英文句子，但将常见搭配1用@替代，常见搭配有多少个单词就用多少个@，比如negotiate a contract可以用@ @ @替代",
          "fullEnglishSentence": "完整的英文句子",
          "chineseTranslation": "句子的中文翻译",
          "chinglishFix": "表达类似想法时典型的中式英语表达及其纠正"
        },
        {
          "scene": "详细的中文场景描述2",
          "chineseIdea": "详细的中文想法2",
          "sentenceWithBlank": "英文句子，但将常见搭配2用@替代，常见搭配有多少个单词就用多少个@，比如negotiate a contract可以用@ @ @替代",
          "fullEnglishSentence": "完整的英文句子",
          "chineseTranslation": "句子的中文翻译",
          "chinglishFix": "表达类似想法时典型的中式英语表达及其纠正"
        }
      ]
    },
    // 如果有多个含义，按相同结构继续添加
  ]
}

请确保：
1. 如果该词有多个意思或用法，请确保列举所有常见的含义。
2. 根据词汇的不同意思，分开列举每个意思的典型用法。 对于每个意思，提供两个具体的使用场景和例句。
3. 除了完整的英文句子外，其他元素不要提及此词汇。
4. 在展示语境时，请结合词汇的常见搭配（Collocations），这些搭配在学习词汇时至关重要，因为它们体现了自然语言使用中的习惯搭配。
5. 请在提供例句时，尽量选择日常实际使用中的例子，而不仅仅是简单的语料库搜索结果。
6. 请用「」把完整的英文句子使用的搭配框起来
7. 请用「」把句子的中文翻译中使用的搭配框起来

""" % word

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

def get_env_value(key):
    try:
        with open("./.env", 'r') as file:
            content = file.read()
        api_key = json.loads(content)[key]
        return api_key
    except Exception as e:
        raise ("读取API key失败，请把 .env_example 文件修改成 .env 文件，并修改里面的API key:", e)
        return None

def write_file(fila_name, content, model):
    try:
        with open(fila_name, 'w') as file:
            file.write(content)
            file.close()
        print(f"文件 {fila_name} 写入成功")
    except Exception as e:
        print(f"文件 {fila_name} 写入失败：{e}")

def get_json_data(API_KEY, start_alpha_list):
    f = open("./aidict-web/wordtxt/CET4_core.txt", "r")
    api_key = API_KEY
    if api_key is None:
        api_key = get_env_value('api_key')
    model = "grok-3"
    # a to z
    alpha_list = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n",
                  "o", "p", "q", "r", "s", "t", "u", "v", "w", "x",
                  "y", "z"]
    used_list = []
    if start_alpha_list is None:
        used_list = alpha_list
    if start_alpha_list is not None:
        used_list = start_alpha_list.split(",")
    k = 0
    m = 0
    for i in f.readlines():
        k = k + 1
        if m > 5:
            break
        word = i.strip()
        start_alpha = word[0].lower()
        if start_alpha not in used_list:
            print(f"跳过字母 {start_alpha} 的单词 {word}")
            continue
        if len(word) == 0:
            continue
        print(f"第 {k} 个单词：{word}")
        # 判断是否存在
        try:
            with open(f"./json_CET4CORE/{str(k) + '-' + word}.json", 'r') as file:
                print(f"文件 {str(k) + '-' + word}.json 已存在，跳过")
                continue
        except FileNotFoundError:
            pass
        try:
            m = m + 1
            response = AIChat(word, model, api_key)
            content = response['choices'][0]['message']['content']
            # 创建文件

            write_file(f"./json_CET4CORE/{str(k) + '-' + word}.json", content, model)
        except Exception as e:
            print(f"获取单词 {word} 的解释失败：{e}")
            time.sleep(5)


def json_to_csv(json_folder, output_csv):
    """
    将JSON格式的单词学习内容转换为CSV格式

    Args:
        json_folder: 存放JSON文件的文件夹路径
        output_csv: 输出的CSV文件路径
    """
    # 创建CSV文件并写入表头
    with open(output_csv, 'w', encoding='utf-8', newline='') as csvfile:
        fieldnames = ['scene', 'chineseIdea', 'sentenceWithBlank',
                      'fullEnglishSentence', 'chineseTranslation', 'chinglishFix', 'audio']

        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()

        # 遍历文件夹中的所有JSON文件
        json_files = glob.glob(os.path.join(json_folder, "*.json"))

        for json_file in json_files:
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)


                # 遍历每个定义
                for definition in data.get('definitions', []):

                    # 遍历每个例句
                    for example in definition.get('examples', []):
                        text = example.get('fullEnglishSentence', '')
                        md = hashlib.md5()
                        md.update(text.encode('utf-8'))
                        unique_id = md.hexdigest()
                        get_voice(text, unique_id)
                        row = {
                            'scene': example.get('scene', ''),
                            'chineseIdea': example.get('chineseIdea', ''),
                            'sentenceWithBlank': example.get('sentenceWithBlank', ''),
                            'fullEnglishSentence': text,
                            'chineseTranslation': example.get('chineseTranslation', ''),
                            'chinglishFix': example.get('chinglishFix', ''),
                            'audio': unique_id + ".wav",
                        }
                        writer.writerow(row)

                print(f"处理文件 {os.path.basename(json_file)} 成功")

            except Exception as e:
                print(f"处理文件 {json_file} 时出错: {str(e)}")

    print(f"转换完成，CSV文件已保存为: {output_csv}")



def get_voice(text, unique_id):
    try:
        cred = credential.Credential("", "")
        httpProfile = HttpProfile()
        httpProfile.endpoint = "aai.tencentcloudapi.com"

        clientProfile = ClientProfile()
        clientProfile.httpProfile = httpProfile
        client = aai_client.AaiClient(cred, "ap-guangzhou", clientProfile)

        text = text.replace("「", "").replace("」", "")

        req = models.TextToVoiceRequest()
        params = {
            "Action": "TextToVoice",
            "ModelType": 1,
            "SessionId": unique_id,
            "Text": text,
            "PrimaryLanguage": 2,
             "VoiceType": 501009,
            # "VoiceType": 501002,
        }
        req.from_json_string(json.dumps(params))

        # 返回的resp是一个TextToVoiceResponse的实例，与请求对象对应
        resp = client.TextToVoice(req)
        # 输出json格式的字符串回包
        audio_base64 = json.loads(resp.to_json_string())['Audio']
        audio_data = base64.b64decode(audio_base64)

        # 保存为wav文件
        with open('./output_voice/%s.wav' % unique_id, 'wb') as f:
            f.write(audio_data)

    except TencentCloudSDKException as err:
        print(err)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--API_KEY",
        dest="API_KEY",
        type=str,
        help="API_KEY",
    )

    parser.add_argument(
        "--START_ALPHA_LIST",
        dest="START_ALPHA_LIST",
        type=str,
        help="START_ALPHA_LIST",
    )

    options = parser.parse_args()
    API_KEY = options.API_KEY
    START_ALPHA_LIST = options.START_ALPHA_LIST
    get_json_data(API_KEY, START_ALPHA_LIST)

    # remove_first_last_lines("./json_CET4CORE", ['.json'])
    # json_to_csv("./json_CET4CORE", "1.csv")













