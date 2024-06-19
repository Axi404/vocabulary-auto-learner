const contentDiv = document.getElementById('content');
const questionsDiv = document.getElementById('questions');
const loadingDiv = document.getElementById('loading');
const submitButton = document.getElementById('submit');
const continueButton = document.getElementById('continue');

let correctAnswers = {};
let userAnswers = {};

function loadContent() {
    loadingDiv.style.display = 'block';
    contentDiv.style.display = 'none';
    questionsDiv.style.display = 'none';
    submitButton.style.display = 'none';
    continueButton.style.display = 'none';
    fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            word_count: 3
        })
    })
    .then(response => response.json())
    .then(data => {
        loadingDiv.style.display = 'none';
        console.log('Received data:', data);  // 添加调试信息
        if (data.message) {
            displayCompletionMessage(data.message);
        } else {
            displayContent(data);
        }
    })
    .catch(error => {
        loadingDiv.style.display = 'none';
        console.error('Error:', error);
    });
}

function displayCompletionMessage(message) {
    contentDiv.innerHTML = `<p>${message}</p>`;
    questionsDiv.innerHTML = '';
    contentDiv.style.display = 'block';
    questionsDiv.style.display = 'none';
    submitButton.style.display = 'none';
    continueButton.style.display = 'none';
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
                document.querySelectorAll(`.question[data-index="${index}"] button`).forEach(btn => {
                    btn.style.backgroundColor = '';
                });
                button.style.backgroundColor = 'lightblue';
            };
            optionsDiv.appendChild(button);
        }

        questionDiv.appendChild(optionsDiv);
        questionDiv.setAttribute('data-index', index);
        questionsDiv.appendChild(questionDiv);

        correctAnswers[index] = qa.answer;
    });
    
    contentDiv.style.display = 'block';
    questionsDiv.style.display = 'block';
    submitButton.style.display = 'block';
    continueButton.style.display = 'none';
}

submitButton.onclick = () => {
    document.querySelectorAll('.question').forEach((questionDiv, index) => {
        
        const userAnswer = userAnswers[index];
        const correctAnswer = correctAnswers[index];

        questionDiv.querySelectorAll('button').forEach(button => {
            const buttonAnswer = button.innerText.split(':')[0]; // 获取按钮的答案

            if (buttonAnswer === correctAnswer && buttonAnswer !== userAnswer) {
                button.style.backgroundColor = 'lightgreen'; // 正确答案按钮变成绿色
            }
        });

        
        if (userAnswer === correctAnswer) {
            questionDiv.style.backgroundColor = 'lightgreen';
        } else {
            questionDiv.style.backgroundColor = 'lightcoral';
        }
    });

    submitButton.style.display = 'none';
    continueButton.style.display = 'block';
};

continueButton.onclick = () => {
    userAnswers = {};
    correctAnswers = {};
    loadContent();
};

loadContent();
