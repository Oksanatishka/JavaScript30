// ------------- TODO: -------------

/* Get Our Elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

/* Build out functions */

// function toggleVideo() {
//     if (video.paused) {
//         toggle.innerHTML = '❚ ❚';
//         video.play();
//     } else {
//         toggle.innerHTML = '►';
//         video.pause();
//     }
// }

// F-n to stop/play video
function togglePlay() {
    const method = video.paused ? 'play' : 'pause';
    video[method]();
}

// F-n to toggle stop/play icon
function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚';
    console.log(icon);
    toggle.textContent = icon;
}

// function changeVolume() {
//     video.volume = ranges.value;
// }

function skip() {
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
    video[this.name] = this.value;
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

// F-n to
function scrub(e) {
    // console.log(e);
    // console.log('e.offsetX ', e.offsetX);
    // console.log('progress.offsetWidth ', progress.offsetWidth);
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
    // console.log('Works!');
}

// toggleBtn.addEventListener('click', toggleVideo);
// video.addEventListener('click', toggleVideo);
// volumeRange.addEventListener('change', changeVolume);

/* Hook up the event listeners */

// callback f-ns https://habr.com/ru/post/151716/
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', e => mousedown && scrub(e));
progress.addEventListener('mousedown', () => (mousedown = true));
progress.addEventListener('mouseup', () => (mousedown = false));
