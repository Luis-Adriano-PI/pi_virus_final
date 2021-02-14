const questionNum = document.querySelector(".numQues");
const questionText = document.querySelector(".textQues");
const optionContainer = document.querySelector(".containerQues");
const answersVerificContainer = document.querySelector(".answersVerific");
const homeBox = document.querySelector(".bodyHome");
const quizBox = document.querySelector(".bodyQuiz");
const resultBox = document.querySelector(".result");
const questionLimit = 5;

let questionCounter = 0;
let currentQuestion;
let availableQuestions = [];
let availableOptions = [];
let correctAnswers = 0;
let attempt = 0;

function setAvailableQuestions() {
    const totalQuestion = quiz.length;
    for(let i = 0; i < totalQuestion; i++) {
        availableQuestions.push(quiz[i]);
    }
    // console.log("salve");
}

function getNewQuestion() {
    questionNum.innerHTML = "Questão " + (questionCounter + 1) + " de " + questionLimit;
    // console.log("salve");

    const questionRandom = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    currentQuestion = questionRandom;
    questionText.innerHTML = currentQuestion.q;

    // nao repetir
    const index1 = availableQuestions.indexOf(questionRandom);
    availableQuestions.splice(index1, 1);

    // alternativa correta
    const optionLen = currentQuestion.options.length;
    for(let i = 0; i < optionLen; i++) {
        availableOptions.push(i);
    }

    optionContainer.innerHTML = '';
    let animationDelay = 0.15;
    for(let i = 0; i < optionLen; i++) {
        const optionIndex = availableOptions[Math.floor(Math.random() * availableOptions.length)];
        const index2 = availableOptions.indexOf(optionIndex);
        availableOptions.splice(index2, 1);

        const option = document.createElement("div");
        option.innerHTML = currentQuestion.options[optionIndex];
        option.id = optionIndex;
        option.style.animationDelay = animationDelay + 's';
        animationDelay = animationDelay + 0.15;
        option.className = "option";
        optionContainer.appendChild(option);
        option.setAttribute("onclick", "getResult(this)");
    }
    questionCounter++;
}

function getResult(element) {
    const id = parseInt(element.id);
    if(id === currentQuestion.answer) {
        element.classList.add("correct");
        updateAnswerIndicator("correct");
        correctAnswers++;
        // console.log(correctAnswers);
    }else {
        // console.log("errrrrou");
        element.classList.add("wrong");
        updateAnswerIndicator("wrong");

        const optionLen = optionContainer.children.length;
        for(let i = 0; i < optionLen; i++) {
            if(parseInt(optionContainer.children[i].id) === currentQuestion.answer) {
                optionContainer.children[i].classList.add("correct");
            }
        }
    }
    attempt++;
    unclickOptions();
}

function unclickOptions() {
    const optionLen = optionContainer.children.length;
    for(let i = 0; i < optionLen; i++) {
        optionContainer.children[i].classList.add("alreadyAnswered");
    }
}

function answerIndicator() {
    answersVerificContainer.innerHTML = '';
    const totalQuestion = questionLimit;
    for(let i = 0; i < totalQuestion; i++) {
        const indicator = document.createElement("div");
        answersVerificContainer.appendChild(indicator);
    }
}

function updateAnswerIndicator(verific) {
    // console.log(verific);
    answersVerificContainer.children[questionCounter - 1].classList.add(verific);
}

function next() {
    if(questionCounter === questionLimit) {
        // console.log("cabo");
        gameOver();
    }else {
        getNewQuestion();
    }
}

function gameOver() {
    quizBox.classList.add("hide");
    resultBox.classList.remove("hide");
    quizResult();
}

function quizResult() {
    resultBox.querySelector(".totalQues").innerHTML = questionLimit;
    resultBox.querySelector(".totalAttempt").innerHTML = attempt;
    resultBox.querySelector(".totalCorrect").innerHTML = correctAnswers;
    resultBox.querySelector(".totalWrong").innerHTML = attempt - correctAnswers;
    const percentage = (correctAnswers/questionLimit) * 100;
    resultBox.querySelector(".percentage").innerHTML = percentage.toFixed(2) + "%";
    resultBox.querySelector(".totalScore").innerHTML = correctAnswers + " / " + questionLimit;
}

function resetQuiz() {
    questionCounter = 0;
    correctAnswers = 0;
    attempt = 0;
    availableQuestions = [];
}

function tryAgain() {
    resultBox.classList.add("hide");
    // quixBox.classList.remove("hide");
    resetQuiz();
    startQuiz();
}


function backToMenu() {
    resultBox.classList.add("hide");
    homeBox.classList.remove("hide");

    resetQuiz();
}

function startQuiz() {

    homeBox.classList.add("hide");
    quizBox.classList.remove("hide");

    setAvailableQuestions();
    getNewQuestion();
    answerIndicator();
}

window.onload = function() {
    homeBox.querySelector(".totalQuestoes").innerHTML = questionLimit;
}