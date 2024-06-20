from flask import Flask, request, jsonify, render_template
import openai
import random
import json
import os

app = Flask(__name__)

# 如有转发站，填写在这里

# openai.api_base = ""
# os.environ['OPENAI_API_BASE'] = ''

# 设置你的OpenAI API密钥
openai.api_key = ''

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
            print(content)
            parsed_content = json.loads(content)
            return parsed_content
        except (json.JSONDecodeError, KeyError) as e:
            print("生成的内容不是有效的JSON格式, 重新生成中...")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    global word_count, words
    if len(words) > word_count:
        selected_words = random.sample(words, word_count)
        words = [word for word in words if word not in selected_words]
    else:
        selected_words = words
        words = []
    # data = request.json
    if words != []:
        content = generate_text_and_questions(selected_words, word_count)
    else:
        return jsonify({'message': '今天的内容学完了'}), 200
    return jsonify(content)

word_count = 0
words = []

if __name__ == '__main__':
    word_count, words = read_words_from_file('words.txt')
    app.run(debug=True)
