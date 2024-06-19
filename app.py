from flask import Flask, request, jsonify
import openai
import random
import json
import os

app = Flask(__name__)

openai.api_base = ""
os.environ['OPENAI_API_BASE'] = ''

# 设置你的OpenAI API密钥
openai.api_key = '你的API密钥'

def read_words_from_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    word_count = int(lines[0].strip())
    words = [line.strip() for line in lines[1:]]
    return word_count, words

def generate_text_and_questions(words, word_count):
    prompt = """请用以下词汇共同写一篇英文短文, 对于每一个英文单词加粗, 并为每个词汇出一个词义选择题(给出英文单词, 并给出四个不同的中文词汇, 其中一个是正确的翻译), 让读者猜测每个单词的中文含义, 选择题有四个选项(ABCD), 其中一个是正确的。并以 JSON 格式提供(直接提供, 无需添加如代码块等内容), 其中包含以下键:content(文章内容, 只有一个),question与answer, 问题以及对应的答案, 一组一组的出现, 答案为单一的单词, 不包括多于内容. 格式完全遵循
    {
        \"content\": \"用提供的词汇生成的英文短文内容\",
        \"questions_answers\": \[
        {
            \"question\": \"What does the word **单词1** mean?\",
            \"word\": \"单词1\",
            \"options\": {
                \"A\": \"答案1\",
                \"B\": \"答案2\",
                \"C\": \"答案3\",
                \"D\": \"答案4\"
            },
            \"answer\": \"正确答案(单一字母)\"
        },
        ......
        ]
    }
    单词如下:""" + ", ".join(words)
    
    while True:
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "system", "content": prompt}]
            )

            content = response.choices[0].message['content']
            parsed_content = json.loads(content)
            return parsed_content
        except (json.JSONDecodeError, KeyError) as e:
            print("生成的内容不是有效的JSON格式, 重新生成中...")

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    words = data['words']
    word_count = data['word_count']
    content = generate_text_and_questions(words, word_count)
    return jsonify(content)

if __name__ == '__main__':
    app.run(debug=True)