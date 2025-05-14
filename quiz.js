// This array holds the quiz data. You can replace this with your own questions, options, and answers.
const quizData = [
  {
    question: "How far did Sweden advance in the 1994 World Cup in USA?",
    options: ["Quarter-finals", "Semi-finals", "Third place", "Group stage"],
    correctAnswer: "Third place",
    image: "world_cup_1994_sweden_team.png" // Added image property
  },
  {
    question: "Who won the 1994 World Cup?",
    options: ["Brazil", "Italy", "Germany", "Argentina"],
    correctAnswer: "Brazil",
    image: "world_cup_1994_brazil_italy.png" // Added image property
  },
  {
    question: "Who was Sweden's top scorer in the 1994 World Cup?",
    options: ["Martin Dahlin", "Henrik Larsson", "Kennet Andersson", "Tomas Brolin"],
    correctAnswer: "Kennet Andersson",
    image: "world_cup_1994_kennet_andersson.png" // Added image property
  },
  {
    question: "Which team did Sweden beat in the third-place match?",
    options: ["Bulgaria", "Romania", "Netherlands", "Italy"],
    correctAnswer: "Bulgaria",
    image: "world_cup_1994_sweden_bulgaria.png" // Added image property
  }
];

let currentQuestion = 0;
let score = 0;

// WebAudio API setup
let audioContext = null;
let correctBuffer = null;
let incorrectBuffer = null;

// Function to load an audio file using WebAudio API
async function loadSound(url) {
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
        console.error("Error loading sound:", error);
        return null;
    }
}

// Function to play a loaded audio buffer
function playSound(buffer) {
    if (!buffer || !audioContext) return;

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
}

// Initialize AudioContext and load sounds on the first user interaction
// This bypasses browser autoplay restrictions
let firstInteraction = false;

function initAudio() {
    if (!firstInteraction) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        loadSound('correct.mp3').then(buffer => correctBuffer = buffer);
        loadSound('incorrect.mp3').then(buffer => incorrectBuffer = buffer);
        firstInteraction = true;
    }
}

function loadQuestion() {
  const questionEl = document.getElementById('question');
  const optionsEl = document.getElementById('options');
  const currentQ = quizData[currentQuestion];
  
  // Clear previous content
  questionEl.innerHTML = '';

  // Add Image if it exists
  if (currentQ.image) {
      const imgEl = document.createElement('img');
      imgEl.src = currentQ.image;
      imgEl.alt = "Question related image"; // Add alt text
      imgEl.classList.add('question-image'); // Add a class for styling
      questionEl.appendChild(imgEl);
  }

  // Add Question text
  const textEl = document.createElement('p');
  textEl.textContent = currentQ.question;
  questionEl.appendChild(textEl);


  optionsEl.innerHTML = '';
  
  currentQ.options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    // Attach event listener and ensure audio context is initialized on click
    button.addEventListener('click', () => {
        initAudio(); // Initialize audio context on first click
        checkAnswer(option);
    });
    optionsEl.appendChild(button);
  });
  
  document.getElementById('next-btn').style.display = 'none';
  document.getElementById('feedback').textContent = '';
}

function checkAnswer(selectedAnswer) {
  const currentQ = quizData[currentQuestion];
  const buttons = document.querySelectorAll('.options button');
  const feedbackEl = document.getElementById('feedback');
  
  buttons.forEach(button => {
    button.disabled = true;
    if (button.textContent === currentQ.correctAnswer) {
      button.classList.add('correct');
    }
    if (button.textContent === selectedAnswer && selectedAnswer !== currentQ.correctAnswer) {
      button.classList.add('incorrect');
    }
  });

  if (selectedAnswer === currentQ.correctAnswer) {
    feedbackEl.textContent = 'Correct!';
    score++;
    playSound(correctBuffer); // Use WebAudio play function
  } else {
    feedbackEl.textContent = `Incorrect. The correct answer is: ${currentQ.correctAnswer}`;
    playSound(incorrectBuffer); // Use WebAudio play function
  }

  document.getElementById('next-btn').style.display = 'block';
  updateScore();
}

function updateScore() {
  document.getElementById('score').textContent = `Score: ${score}/${quizData.length}`;
}

document.getElementById('next-btn').addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    // End of quiz
    const quizContainer = document.querySelector('.quiz-container');
    quizContainer.innerHTML = `
      <h1>Quiz Complete!</h1>
      <div class="score">Final Score: ${score}/${quizData.length}</div>
      <button onclick="location.reload()">Play Again</button>
    `;
  }
});

// Initial load
loadQuestion();
updateScore();