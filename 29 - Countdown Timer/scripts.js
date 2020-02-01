// ------------- TODO: -------------
let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
    // setInterval(() => {   // this code has some issues
    //     seconds--;
    // }, 1000);

    // clear any existing timer
    clearInterval(countdown);

    // const now = new Date().getTime();   // Previously
    const now = Date.now(); // give us the current timestamp in milliseconds
    const then = now + seconds * 1000;
    // console.log(now, then);
    displayTimeLeft(seconds);
    displayEndTime(then);
    // now every single second, we need to display the amount of time left.
    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        if (secondsLeft < 0) {
            clearInterval(countdown);
            return; // we could 'return' which will stop the function from running, but that's not really going to help us, it's just going to run but not show us anything.
            // What we need to do is to store this setInterval in its own variable.
        }
        displayTimeLeft(secondsLeft);
        console.log(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {
    console.log(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    console.log(minutes, remainderSeconds);

    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;

    document.title = display; // to update tab title in browser
    timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    const hour = end.getHours();
    const adjustedHour = hour > 12 ? hour - 12 : hour;
    const minutes = end.getMinutes();
    // endTime.textContent = `Be back at ${hour}:${minutes}`;  // for Europinians ok!
    endTime.textContent = `Be back at ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}`; // for Americans ok!
}

function startTimer() {
    // console.log(this);
    // console.log(this.dataset);
    console.log(this.dataset.time);

    const seconds = parseInt(this.dataset.time); // parseInt - to convert into number
    console.log(seconds);

    timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));

// document.customForm - works with name attribute
document.customForm.addEventListener('submit', function(e) {
    // How do we stop it from reloading the page and sending the data over a get? -> e.preventdefault();
    e.preventDefault();
    console.log(this);
    const mins = this.minutes.value; // this.minutes - because we take input not form tag
    console.log(mins);
    timer(mins * 60);
    this.reset();
});
