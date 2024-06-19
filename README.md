# Vocabulary-Auto-Learner

**V**ocabulary-**A**uto-**L**earner (VAL) 是通过chatgpt辅助复习英语单词的简易工具，仅使用简易的python脚本实现，依赖较少，等待进一步二次开发。

## Requirements

```python
conda create -n val python=3.8
conda activate val
pip install openai==0.28
pip install flask
```

## Usage

填写main.py中的api。

修改words.txt中的词库，其中第一行是一次性学习的单词数量。VAL的运行逻辑是通过词库中的若干单词生成一篇短文，并且要求读者回答单词的含义。

```python
python app.py
```

打开`127.0.0.1:5000`即可访问。

## License

MIT License