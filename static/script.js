const contentDiv = document.getElementById('content');
const questionsDiv = document.getElementById('questions');
const loadingDiv = document.getElementById('loading');
const resultsDiv = document.getElementById('results');
const submitButton = document.getElementById('submit');

let correctAnswers = {};
let userAnswers = {};

function loadContent() {
    loadingDiv.style.display = 'block';
    fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            words: ['apple', 'banana', 'cherry'], // 这里可以替换为实际的单词
            word_count: 3
        })
    })
    .then(response => response.json())
    .then(data => {
        loadingDiv.style.display = 'none';
        displayContent(data);
    })
    .catch(error => {
        loadingDiv.style.display = 'none';
        console.error('Error:', error);
    });
}

function displayContent(data) {
    contentDiv.innerHTML = `<p>${data.content}</p>`;
    questionsDiv.innerHTML = '';

    data.questions_answers.forEach((qa, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.innerHTML = `<p>${qa.question}</p>`;

        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('options');
        for (const [key, value] of Object.entries(qa.options)) {
            const button = document.createElement('button');
            button.innerText = `${key}: ${value}`;
            button.onclick = () => {
                userAnswers[index] = key;
                button.style.backgroundColor = 'lightblue';
            };
            optionsDiv.appendChild(button);
        }

        questionDiv.appendChild(optionsDiv);
        questionsDiv.appendChild(questionDiv);

        correctAnswers[index] = qa.answer;
    });
}

submitButton.onclick = () => {
    let correctWords = [];
    let incorrectWords = [];
    for (const [index, answer] of Object.entries(userAnswers)) {
        if (answer === correctAnswers[index]) {
            correctWords.push(index);
        } else {
            incorrectWords.push(index);
        }
    }

    resultsDiv.innerHTML = `<p>正确的单词: ${correctWords.join(', ')}</p>`;
    if (incorrectWords.length > 0) {
        resultsDiv.innerHTML += `<p>错误的单词: ${incorrectWords.join(', ')}</p>`;
    } else {
        resultsDiv.innerHTML += `<p>恭喜你，全部答对了！</p>`;
    }
};

loadContent();
