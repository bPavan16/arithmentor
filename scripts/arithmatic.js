// ----------------- DOM Elements Stored in varibales --------------------------
const settingsCard = document.getElementById('settingsCard');
const questionCard = document.getElementById('questionCard');
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const answerValueEl = document.getElementById('answerValue');
const timerBar = document.getElementById('timerBar');
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const progressEl = document.getElementById('progress');
const currentQuestionEl = document.getElementById('currentQuestion');
const totalQuestionsEl = document.getElementById('totalQuestions');
const scoreEl = document.getElementById('score');
const digitButtons = document.querySelectorAll('.digit-btn');

// ----------------Settings Elements stored in varibales------------------------
const digitSelection = document.getElementById('digitSelection');
const timerDurationInput = document.getElementById('timerDuration');
const operationsSelect = document.getElementById('operations');
const questionCountInput = document.getElementById('questionCount');

// ----------------------State variables------------------------------------------
let currentQuestion = 0;
let totalQuestions = 10;
let score = 0;
let timerDuration = 10;
let currentAnswer = 0;
let timerInterval;
let selectedDigits = 3; // Default to 3 digits

//------------------------- Event listeners-------------------------------
startBtn.addEventListener('click', startPractice);
nextBtn.addEventListener('click', nextQuestion);

// ----------------- Set up digit selection buttons ---------------------------
digitButtons.forEach(button => {
    button.addEventListener('click', function () {

        // Remove selected class from all buttons
        digitButtons.forEach(btn => btn.classList.remove('selected'));

        // Add selected class to clicked button
        this.classList.add('selected');

        // Update selected digits value
        selectedDigits = parseInt(this.dataset.value);
    });
});

// ----------- Initialize app ------------------
function initializeApp() {
    // Hide question card initially
    questionCard.style.display = 'none';
    nextBtn.style.display = 'none';

    // Set default values
    currentQuestion = 0;
    score = 0;
    updateProgress();
}

// -------------  Start the practice session ----------------
function startPractice() {
    // Get settings
    timerDuration = parseInt(timerDurationInput.value);
    const operations = operationsSelect.value;
    totalQuestions = parseInt(questionCountInput.value);

    // ------------------ Validate settings -------------------------
    if (timerDuration < 3 || timerDuration > 60) {
        alert('Timer duration must be between 3 and 60 seconds');
        return;
    }

    if (totalQuestions < 5 || totalQuestions > 50) {
        alert('Number of questions must be between 5 and 50');
        return;
    }

    //  Hide settings, show question 
    settingsCard.style.display = 'none';
    questionCard.style.display = 'block';
    questionCard.style.animation = 'fadeIn 0.5s forwards';

    // Reset progress
    currentQuestion = 0;
    score = 0;
    updateProgress();

    // Start first question
    generateQuestion();
}

//----------------  Generate a new arithmetic question ----------------------
function generateQuestion() {
    // Clear previous answer display
    answerEl.classList.remove('show');
    nextBtn.style.display = 'none';

    // Increment question counter
    currentQuestion++;
    updateProgress();

    // Get settings
    const numberLength = selectedDigits;
    const operations = operationsSelect.value;

    // Generate random numbers based on number length
    const minNum = Math.pow(10, numberLength - 1);
    const maxNum = Math.pow(10, numberLength) - 1;

    let num1, num2, operation, operationSymbol;

    // Determine operation based on selection
    switch (operations) {
        case 'add':
            operation = 'addition';
            operationSymbol = '+';

            // For large digits, limit one number to be smaller to keep answers manageable
            if (numberLength >= 5) {
                num1 = getRandomInt(minNum, maxNum);
                num2 = getRandomInt(minNum / 10, minNum * 2);
            } else {
                num1 = getRandomInt(minNum, maxNum);
                num2 = getRandomInt(minNum, maxNum);
            }

            currentAnswer = num1 + num2;
            break;

        case 'subtract':
            operation = 'subtraction';
            operationSymbol = '-';

            num1 = getRandomInt(minNum, maxNum);
            // For larger digits, make num2 smaller to keep results positive and manageable
            if (numberLength >= 5) {
                num2 = getRandomInt(minNum / 10, num1 / 2);
            } else {
                num2 = getRandomInt(minNum / 2, num1);
            }

            currentAnswer = num1 - num2;
            break;

        case 'multiply':
            operation = 'multiplication';
            operationSymbol = '×';

            // For multiplication with large digits, scale down numbers to keep results manageable
            if (numberLength >= 5) {
                // One bigger number and one much smaller number
                num1 = getRandomInt(minNum / 10, maxNum / 5);
                num2 = getRandomInt(2, 20); // Small multiplier for large digits
            } else if (numberLength == 4) {
                num1 = getRandomInt(minNum / 5, maxNum / 2);
                num2 = getRandomInt(2, 50);
            } else if (numberLength == 3) {
                num1 = getRandomInt(minNum / 2, maxNum);
                num2 = getRandomInt(2, 100);
            } else {
                num1 = getRandomInt(minNum, maxNum);
                num2 = getRandomInt(2, minNum / 2);
            }

            currentAnswer = num1 * num2;
            break;

        case 'divide':
            operation = 'division';
            operationSymbol = '÷';

            // For division, ensure clean division with no remainder
            if (numberLength >= 5) {
                currentAnswer = getRandomInt(minNum / 100, minNum / 10);
                num2 = getRandomInt(2, 15);
            } else if (numberLength >= 4) {
                currentAnswer = getRandomInt(minNum / 50, minNum / 5);
                num2 = getRandomInt(2, 20);
            } else {
                currentAnswer = getRandomInt(10, minNum / 2);
                num2 = getRandomInt(2, Math.min(50, minNum / 10));
            }

            num1 = currentAnswer * num2;
            break;

        case 'add-subtract':
            operation = Math.random() > 0.5 ? 'addition' : 'subtraction';
            operationSymbol = operation === 'addition' ? '+' : '-';

            if (operation === 'addition') {
                // For large digits, limit one number to be smaller
                if (numberLength >= 5) {
                    num1 = getRandomInt(minNum, maxNum);
                    num2 = getRandomInt(minNum / 10, minNum * 2);
                } else {
                    num1 = getRandomInt(minNum, maxNum);
                    num2 = getRandomInt(minNum, maxNum);
                }
                currentAnswer = num1 + num2;
            } else {
                num1 = getRandomInt(minNum, maxNum);
                // For larger digits, make num2 smaller
                if (numberLength >= 5) {
                    num2 = getRandomInt(minNum / 10, num1 / 2);
                } else {
                    num2 = getRandomInt(minNum / 2, num1);
                }
                currentAnswer = num1 - num2;
            }
            break;

        case 'multiply-divide':
            operation = Math.random() > 0.5 ? 'multiplication' : 'division';
            operationSymbol = operation === 'multiplication' ? '×' : '÷';

            if (operation === 'multiplication') {
                // For multiplication with large digits, scale down numbers
                if (numberLength >= 5) {
                    num1 = getRandomInt(minNum / 10, maxNum / 5);
                    num2 = getRandomInt(2, 20);
                } else if (numberLength == 4) {
                    num1 = getRandomInt(minNum / 5, maxNum / 2);
                    num2 = getRandomInt(2, 50);
                } else if (numberLength == 3) {
                    num1 = getRandomInt(minNum / 2, maxNum);
                    num2 = getRandomInt(2, 100);
                } else {
                    num1 = getRandomInt(minNum, maxNum);
                    num2 = getRandomInt(2, minNum / 2);
                }
                currentAnswer = num1 * num2;
            } else {
                // For division, ensure clean division
                if (numberLength >= 5) {
                    currentAnswer = getRandomInt(minNum / 100, minNum / 10);
                    num2 = getRandomInt(2, 15);
                } else if (numberLength >= 4) {
                    currentAnswer = getRandomInt(minNum / 50, minNum / 5);
                    num2 = getRandomInt(2, 20);
                } else {
                    currentAnswer = getRandomInt(10, minNum / 2);
                    num2 = getRandomInt(2, Math.min(50, minNum / 10));
                }
                num1 = currentAnswer * num2;
            }
            break;

        default: // 'all'
            const ops = ['addition', 'subtraction', 'multiplication', 'division'];
            operation = ops[Math.floor(Math.random() * ops.length)];

            if (operation === 'addition') {
                operationSymbol = '+';
                if (numberLength >= 5) {
                    num1 = getRandomInt(minNum, maxNum);
                    num2 = getRandomInt(minNum / 10, minNum * 2);
                } else {
                    num1 = getRandomInt(minNum, maxNum);
                    num2 = getRandomInt(minNum, maxNum);
                }
                currentAnswer = num1 + num2;
            } else if (operation === 'subtraction') {
                operationSymbol = '-';
                num1 = getRandomInt(minNum, maxNum);
                if (numberLength >= 5) {
                    num2 = getRandomInt(minNum / 10, num1 / 2);
                } else {
                    num2 = getRandomInt(minNum / 2, num1);
                }
                currentAnswer = num1 - num2;
            } else if (operation === 'multiplication') {
                operationSymbol = '×';
                if (numberLength >= 5) {
                    num1 = getRandomInt(minNum / 10, maxNum / 5);
                    num2 = getRandomInt(2, 20);
                } else if (numberLength == 4) {
                    num1 = getRandomInt(minNum / 5, maxNum / 2);
                    num2 = getRandomInt(2, 50);
                } else if (numberLength == 3) {
                    num1 = getRandomInt(minNum / 2, maxNum);
                    num2 = getRandomInt(2, 100);
                } else {
                    num1 = getRandomInt(minNum, maxNum);
                    num2 = getRandomInt(2, minNum / 2);
                }
                currentAnswer = num1 * num2;
            } else { // division
                operationSymbol = '÷';
                if (numberLength >= 5) {
                    currentAnswer = getRandomInt(minNum / 100, minNum / 10);
                    num2 = getRandomInt(2, 15);
                } else if (numberLength >= 4) {
                    currentAnswer = getRandomInt(minNum / 50, minNum / 5);
                    num2 = getRandomInt(2, 20);
                } else {
                    currentAnswer = getRandomInt(10, minNum / 2);
                    num2 = getRandomInt(2, Math.min(50, minNum / 10));
                }
                num1 = currentAnswer * num2;
            }
    }

    // Display the question
    questionEl.textContent = `${num1} ${operationSymbol} ${num2}`;
    answerValueEl.textContent = currentAnswer;

    // Start the timer
    startTimer();
}

// Start the countdown timer
function startTimer() {
    // Reset timer bar
    timerBar.style.transition = 'none';
    timerBar.style.transform = 'scaleX(1)';

    // Force reflow
    void timerBar.offsetWidth;

    // Start animation
    timerBar.style.transition = `transform ${timerDuration}s linear`;
    timerBar.style.transform = 'scaleX(0)';

    // Clear any existing timer
    if (timerInterval) clearTimeout(timerInterval);

    // Set timeout to show answer
    timerInterval = setTimeout(showAnswer, timerDuration * 1000);
}

// Show the answer after timer expires
function showAnswer() {
    answerEl.classList.add('show');
    nextBtn.style.display = 'block';

    // If this was the last question, show final score
    if (currentQuestion >= totalQuestions) {
        nextBtn.textContent = 'See Final Score';
    }

    // Move to the next question after a delay of 3 seconds
    setTimeout(nextQuestion, 2000);
}

// Move to the next question
function nextQuestion() {
    if (currentQuestion >= totalQuestions) {
        // Practice session complete
        showFinalScore();
    } else {
        // Generate the next question
        generateQuestion();
    }
}

// Show final score and return to settings
function showFinalScore() {
    alert(`Practice complete!\nYour score: ${score} out of ${totalQuestions}`);

    // Reset to settings screen
    settingsCard.style.display = 'block';
    questionCard.style.display = 'none';
    nextBtn.textContent = 'Next Question';

    // Reset progress and score
    currentQuestion = 0;
    score = 0;
    updateProgress();
}

// Update the progress display
function updateProgress() {
    currentQuestionEl.textContent = currentQuestion;
    totalQuestionsEl.textContent = totalQuestions;
    scoreEl.textContent = score;
}

// Helper function to get random integer between min and max (inclusive)
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize the app
initializeApp();