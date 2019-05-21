let score = 0;
let questions = [];
let pageIndex = 0;
let loading = true;



(function onLoad() {
    fetch('https://opentdb.com/api.php?amount=10&category=9&type=multiple')
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            questions = questions.concat(data.results);
            loading = false;
        });
})();


function getMain() {
    return document.getElementById('main');
}


function retrieveQuestion() {
    if (loading) {
        getMain().innerHTML = 'Loading...';
        setTimeout(retrieveQuestion, 500);
    }
    else {
        displayScreen();
    }
}

function displayScreen() {
    if (pageIndex === 10) {
        return displayEndScreen();
    }
    return displayQuestion();
}

function displayQuestion() {
    getMain().innerHTML = '';
    const questionHeader = document.createElement('H2');
    questionHeader.innerText = decodeHtml(questions[pageIndex].question);

    questionHeader.setAttribute('class', 'questionHeader')

    const answers = createAnswersArray(
        questions[pageIndex].incorrect_answers,
        questions[pageIndex].correct_answer,
    );

    const list = document.createElement('OL');

    const answersListItems = answers.forEach(function(answer) {
        
        const listItem = document.createElement('LI');
        const radio = document.createElement('INPUT');
        const label = document.createElement('LABEL');
       
        
        
        label.innerText = decodeHtml(answer);

        radio.setAttribute('type', 'radio');
        radio.setAttribute('name', 'answer');
        radio.setAttribute('value', answer);
        radio.setAttribute('class', 'radioInput'); 
        label.setAttribute('class', 'answers'); 

        listItem.appendChild(radio);
        listItem.appendChild(label);
        list.appendChild(listItem);

    

    });

    const image = document.createElement('IMG'); 
    image.setAttribute('src', 'gorilla.gif'); 
    image.setAttribute('class', 'thinkingImage');


    const nextButton = document.createElement('BUTTON');

    nextButton.setAttribute('class', 'btn btn-warning');
    nextButton.setAttribute('id', 'nextButton');
    

    nextButton.innerText = 'Next Question';
    nextButton.onclick = submitAnswer;

    getMain().appendChild(questionHeader);
    getMain().appendChild(image);
    getMain().appendChild(list);
    getMain().appendChild(nextButton);
    
}

function displayEndScreen() {
    getMain().innerHTML = "";
    const endMessage = document.createElement('DIV');
    const yourScore = document.createElement('DIV');
    const tryAgain = document.createElement('A');
    const thanksPic = document.createElement('IMG');

    endMessage.setAttribute('id', 'end');
    yourScore.setAttribute('id', 'yourScore');
    tryAgain.setAttribute('class', 'tryAgain');
    tryAgain.setAttribute('href', 'index.html');
    thanksPic.setAttribute('src', 'gatsby.gif');
    thanksPic.setAttribute('id', 'thanks-pic');

    endMessage.innerHTML = 'Thank you for taking the quiz!';
    yourScore.innerHTML = 'You got ' + score + ' /10!'
    tryAgain.innerHTML = 'Try again?';

    getMain().appendChild(endMessage);
    getMain().appendChild(yourScore);
    getMain().appendChild(tryAgain);
    getMain().appendChild(thanksPic);

    
    document.getElementById('fb-root').innerHTML += '<div class="fb-share-button" data-href="http://www.slaptrump.org/index.html" data-layout="button_count" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fwww.slaptrump.org%2Fshare.html&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div>'


}

function createAnswersArray(incorrectAnswers, correctAnswer) {
    const randomIndex = Math.floor(Math.random() * 4);
    const answers = incorrectAnswers.slice();
    answers[randomIndex] = correctAnswer;
    if (randomIndex < 3) {
        answers.push(incorrectAnswers[randomIndex]);
    }
    return answers;
}

function addScore() {
    function getSpan() { return document.getElementById('score'); }
    score++;
    getSpan().innerText = String(score);  
}

function submitAnswer() {
    const answerSubmitted = checkAnswer();
    if (!answerSubmitted) {
        return alert('You must pick an answer!');
    }
    pageIndex++;
    displayScreen();
}

function checkAnswer() {
    const radios = document.getElementsByTagName('input');
    let answer;
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            answer = radios[i].value;
            break;
        }
    }
    if (!answer) {
        return false;
    }
    if (answer === questions[pageIndex].correct_answer) {
        addScore();
    }
    return true;
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
