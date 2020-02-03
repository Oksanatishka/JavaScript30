// ./lib/elements.js
const jokeButton = document.querySelector('.getJoke');
const jokeButtonSpan = jokeButton.querySelector('.jokeText');
const jokeHolder = document.querySelector('.joke p');
const loader = document.querySelector('.loader');

// ./data/buttonText.js
const buttonText = [
    'Ugh.',
    '🤦🏻‍♂️',
    'omg dad.',
    'you are the worst',
    'seriously',
    'stop it.',
    'please stop',
    'that was the worst one'
];

// ./lib/index.js
async function fetchJoke() {
    // turn loader on
    loader.classList.remove('hidden');
    const response = await fetch('https://icanhazdadjoke.com', {
        headers: {
            Accept: 'application/json'
        }
    });
    const data = await response.json();
    // turn the loader off
    loader.classList.add('hidden');
    return data;
}

// ./lib/utils.js
function randomItemFromArray(arr, not) {
    const item = arr[Math.floor(Math.random() * arr.length)];
    if (item === not) {
        console.log('Ahh we used that one last time, look again');
        return randomItemFromArray(arr, not);
    }
    return item;
}

// ./lib/handlers.js
async function handleClick() {
    const { joke } = await fetchJoke();
    jokeHolder.textContent = joke;
    jokeButtonSpan.textContent = randomItemFromArray(buttonText, jokeButtonSpan.textContent);
}

// ./jokes.js
jokeButton.addEventListener('click', handleClick);
