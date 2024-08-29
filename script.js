const typing = document.getElementById("textBox");
const start1 = document.getElementById("5min");
const start2 = document.getElementById("10min");
const timerDisplay = document.getElementById("time");
const grammarFeedbackElement = document.getElementById("grammar-feedback");

let time;
let isTimeRunning = false;
typing.disabled = true;

// start1.onclick = ()=>{
//     typing.disabled = false;
//      setTimeout(()=>{
//         typing.disabled = true;
//     },5*60*1000)
// }

// start2.onclick = ()=>{
//     typing.disabled = false;
//     setTimeout(()=>{
//         typing.disabled = true;
//     },10*60*1000)
// }

let timerInterval;
function startTimer(timeRemaining) {
    if(!isTimeRunning){
    isTimeRunning = true;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        if (timeRemaining <= 0 || !isTimeRunning) {
            clearInterval(timerInterval);
            typing.disabled = true;
        }
        
        timeRemaining--;
    }, 1000);
}}
start1.addEventListener('click', () => {
    time = 899; 
    timerDisplay.textContent = "15:00"; 
    typing.disabled = false;
    typing.value =""; 
    typing.focus();
    if(isTimeRunning){
        isTimeRunning=false;
    }
});
start2.addEventListener('click', () => {
    time = 599;
    timerDisplay.textContent = "10:00";
     typing.disabled = false;
     typing.value =""; 
     typing.focus();
     if(isTimeRunning){
        isTimeRunning=false;
    }
});

typing.addEventListener('input',()=>{
    
    startTimer(time);
})


//spell and grammar check api call


// Function to display grammar feedback
 function displayGrammarFeedback(matches) {
    if (matches.length === 0) {
        grammarFeedbackElement.textContent = 'No grammatical errors found.';
        return;
    }

    const feedbackList = matches.map(match => `- ${match.message}`).join('\n');
    grammarFeedbackElement.textContent = `Grammatical issues found:\n${feedbackList}`;
}

// Debounce function to limit API calls
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Event listener for input changes with debounce
typing.addEventListener('input', debounce(async (e) => {
    startTimer(time);
    const text = e.target.value;
    if (text.length > 0) {
        const matches = await checkGrammar(text);
        displayGrammarFeedback(matches);
    }
}, 1000)); // Wait for 1 second of inactivity before checking grammar