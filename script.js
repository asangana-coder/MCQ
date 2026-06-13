const questions = [
  {
    question: 'Which phase of the software development lifecycle focuses on understanding user needs and defining system requirements?',
    options: ['Design', 'Testing', 'Requirements Analysis', 'Deployment'],
    answer: 'Requirements Analysis'
  },
  {
    question: 'What is the primary goal of Agile software development?',
    options: ['Fixed scope delivery', 'Continuous improvement and flexibility', 'Minimal documentation', 'Strict waterfall planning'],
    answer: 'Continuous improvement and flexibility'
  },
  {
    question: 'Which design principle encourages reducing coupling between software modules?',
    options: ['Encapsulation', 'High cohesion', 'Separation of concerns', 'Open/Closed Principle'],
    answer: 'Separation of concerns'
  },
  {
    question: 'In version control systems, what does a branch typically represent?',
    options: ['A backup copy', 'A parallel line of development', 'A deployment target', 'A release candidate'],
    answer: 'A parallel line of development'
  },
  {
    question: 'Which testing type is primarily concerned with how components interact with each other?',
    options: ['Unit testing', 'Integration testing', 'Regression testing', 'Acceptance testing'],
    answer: 'Integration testing'
  },
  {
    question: 'What does UML stand for in software engineering?',
    options: ['Universal Modeling Language', 'Unified Modeling Language', 'User Machine Language', 'Universal Methodology Layout'],
    answer: 'Unified Modeling Language'
  },
  {
    question: 'Which software quality attribute refers to the ease of modifying a system?',
    options: ['Reliability', 'Maintainability', 'Performance', 'Scalability'],
    answer: 'Maintainability'
  },
  {
    question: 'What is a common benefit of performing code reviews?',
    options: ['Faster compilation', 'Improved code quality', 'Guaranteed zero defects', 'Reduced memory usage'],
    answer: 'Improved code quality'
  },
  {
    question: 'Which model is characterized by discrete, sequential phases like requirements, design, implementation, and testing?',
    options: ['Agile', 'Scrum', 'Waterfall', 'Kanban'],
    answer: 'Waterfall'
  },
  {
    question: 'What is the purpose of a software requirements specification (SRS)?',
    options: ['Track bugs and fixes', 'Describe the system behavior and constraints', 'Design the user interface', 'Define deployment infrastructure'],
    answer: 'Describe the system behavior and constraints'
  }
];

let currentIndex = 0;
let score = 0;
let selectedAnswers = [];
let timerId = null;
let timeLeft = 30;

const questionNumberEl = document.getElementById('questionNumber');
const questionTextEl = document.getElementById('questionText');
const optionsEl = document.getElementById('options');
const timerEl = document.getElementById('timer');
const nextButton = document.getElementById('nextButton');
const resultEl = document.getElementById('result');

function startQuiz() {
  currentIndex = 0;
  score = 0;
  selectedAnswers = Array(questions.length).fill('');
  resultEl.innerHTML = '';
  showQuestion();
}

function showQuestion() {
  const current = questions[currentIndex];
  questionNumberEl.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  questionTextEl.textContent = current.question;
  optionsEl.innerHTML = '';

  current.options.forEach((option, index) => {
    const optionId = `option${index}`;
    const label = document.createElement('label');
    label.className = 'option-label';
    label.innerHTML = `
      <input type="radio" name="answer" id="${optionId}" value="${option}">
      <span>${option}</span>
    `;
    optionsEl.appendChild(label);
  });

  const saved = selectedAnswers[currentIndex];
  if (saved) {
    const input = document.querySelector(`input[name='answer'][value='${CSS.escape(saved)}']`);
    if (input) input.checked = true;
  }

  nextButton.textContent = currentIndex === questions.length - 1 ? 'Finish' : 'Next';
  resetTimer();
}

function resetTimer() {
  clearInterval(timerId);
  timeLeft = 30;
  timerEl.textContent = `${timeLeft}s`;
  timerId = setInterval(() => {
    timeLeft -= 1;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      recordAnswer();
      moveToNextQuestion();
    } else {
      timerEl.textContent = `${timeLeft}s`;
    }
  }, 1000);
}

function recordAnswer() {
  const selected = document.querySelector('input[name="answer"]:checked');
  selectedAnswers[currentIndex] = selected ? selected.value : '';
}

function moveToNextQuestion() {
  recordAnswer();
  if (currentIndex < questions.length - 1) {
    currentIndex += 1;
    showQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  clearInterval(timerId);
  score = 0;
  questions.forEach((question, index) => {
    if (selectedAnswers[index] === question.answer) {
      score += 1;
    }
  });

  const total = questions.length;
  let html = `<h2>Your Score: ${score} / ${total}</h2>`;
  html += '<div class="summary">';
  questions.forEach((question, index) => {
    const answer = selectedAnswers[index] || 'No answer';
    const correct = question.answer;
    const status = answer === correct ? 'correct' : 'incorrect';
    html += `
      <div class="summary-item ${status}">
        <strong>Q${index + 1}:</strong> ${question.question}
        <div>Your answer: ${answer}</div>
        <div>Correct answer: ${correct}</div>
      </div>
    `;
  });
  html += '</div>';
  resultEl.innerHTML = html;
  document.getElementById('quizCard').style.display = 'none';
}

nextButton.addEventListener('click', moveToNextQuestion);

startQuiz();
