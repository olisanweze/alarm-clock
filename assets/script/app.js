'use strict';

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  utility functions                                    */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function listen(event, selector, callback) {
    return selector.addEventListener(event, callback);
}
  
function select(selector) {
    return document.querySelector(selector);
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  component                                            */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */

const time = select('.clock-time');
const hour = select('.hour');
const minutes = select('.minutes');
const alarm = select('.alarm span');
const set = select('.set-alarm');
let now = null;
const future = new Date();
let ready = false;

const audio = new Audio('./assets/audio/alarm-sound.wav');
audio.type = 'audio/wav';

function clearInputs() {
    hour.value = '';
    minutes.value = '';
}

listen('load', window, () => {
    clearInputs();
});

const options = {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
}

function alarmTimeDisplay() {
    let last = 0;
    const render = now => {
        if (last === 0 || now - last >= 1000) {
        last = now;
        time.innerText = new Date().toLocaleTimeString('en-ca', options);
        }
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

// this function compares the current time and the set time, and plays the alarm 
// once the set time is reached
function timeCompare(one, two) {
    let timeOne = `${one.getHours()}${one.getMinutes()}${one.getSeconds()}`;
    let timeTwo = `${two.getHours()}${two.getMinutes()}${two.getSeconds()}`;

    if (timeOne === timeTwo) {
        time.classList.add('purple');
        audio.play();
        ready = false;
        setTimeout(() => { time.classList.remove('purple'); }, 6800);
    }
}

// learn more about built-in JS functions like setInterval()
setInterval(() => {
    now = new Date();
    if (ready) timeCompare(now, future);
}, 1000);

listen('input', time, () => {
    let hour = time.value.trim();
    if (hour.length === 2) {
        time.value = `${hour}:`;
    }
});

listen('input', hour, () => {
    let regex = /^\d+$/;
    let input = hour.value.trim();
    if (!regex.test(input)) hour.value = '';
});

listen('input', minutes, () => {
    let regex = /^\d+$/;
    let input = minutes.value.trim();
    if (!regex.test(input)) minutes.value = '';
});

// function that checks if the value entered is valid and focuses on the input
// if user input fails the validation
function isValid(i, l, e) {
    if (i.length === 2 && parseInt(i) >= 0 && parseInt(i) <= l) {
        return true;
    }

    e.focus();
    return false;
}

listen('click', set, () => {
    let h = hour.value;
    let m = minutes.value;

    if (isValid(h, 23, hour) && isValid(m, 59, minutes)) {
        alarm.innerText = `${h}:${m}`;
        future.setHours(h);
        future.setMinutes(m);
        future.setSeconds(0);
        ready = true;
        clearInputs();
    }
});

alarmTimeDisplay();