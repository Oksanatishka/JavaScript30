const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// ------------- TODO: -------------
// Before we get started today, there is one thing that we do need to get up and running, and that is a server.
// Because of security restrictions with getting a user's webcam, it must be tied to what's called a "secure
// origin". A secure origin is a website that is HTTPS, or in our case localhost is also a secure origin.
// Even if it's not, has a little icon lock there, it's still considered a secure origin, which is localhost.
// Now, if you don't have any sort of server locally, what I've done is I've included a package.JSON file.
// If we open that up, you'll see that I have one dependency, it allows you to open up your website and start
// a little server,and it also gives you live reloading and a whole bunch of other stuff.
// Type "npm install" -> "npm start" (run the script called 'start') -> it starts a little server for you http://localhost:3001.

// 1) get the video being piped into that video element.

function getVideo() {
    // Accessing Your Webcam https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
            console.log(localMediaStream);
            //  take our video, and set the source to be that "localMediaStream". Now, that's not
            // going to work automatically, because this is an object. In order for
            // our video to work, it actually needs to be converted into some sort of URL.
            // This is a little bit weird, because you might be used to having a video like a .mp4. But
            // this is how you set it to be a live video feed. So we're going to wrap this
            // "localMediaStream" in window.url caps ".createObjectURL". That's going to
            // convert that media stream into something that this video player can understand.

            // video.src = window.URL.createObjectURL(localMediaStream);
            // video.play();

            //  DEPRECIATION :
            //       The following has been depreceated by major browsers as of Chrome and Firefox.
            //       video.src = window.URL.createObjectURL(localMediaStream);
            //       Please refer to these:
            //       Depreceated  - https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
            //       Newer Syntax - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject

            video.srcObject = localMediaStream;
            video.play(); // now you should see yourself in the actual video element in the top right-hand corner!!
            // If you inspect video tag, you'll see that the video source is a blob. That just means that it's the raw
            // data being piped in off this webcam.
        })
        .catch(err => {
            console.error('OH NO!!', err);
        });
    // We need to handle that error, just in case someone doesn't allow you to access their webcam.
}

// 2) take a frame from this video, and paint it onto the actual canvas on the screen.
function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    // now we are going to take an image from the webcam 16 or so milliseconds and put it into the canvas.
    // use 'return' because if you ever need to stop this from painting, you can have access to that interval and you can call "clearInterval" on it.
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // So the way that a filter works is that you get the pixels out of the canvas -> and then you mess with them, changing the RGB values, and -> put them back in.
        let pixels = ctx.getImageData(0, 0, width, height); // take the pixels out
        // console.log(pixels)

        // pixels = redEffect(pixels);
        pixels = rgbSplit(pixels); // apply filter to pixels
        ctx.globalAlpha = 0.1; // ghosting
        // ctx.globalAlpha = 0.8;
        // pixels = greenScreen(pixels);
        ctx.putImageData(pixels, 0, 0); // put pixels back
    }, 16);
}

function takePhoto() {
    // play the sound
    snap.currentTime = 0;
    snap.play();
    // take the data out of the canvas
    const data = canvas.toDataURL('/image/jpeg');
    console.log(data); // if you call takePhoto() in inspector, you'll see long answer - this is "Base64". This is like a text-based representation of the picture of me.
    // create a link
    let link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    // link.textContent = 'Download Image';
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
    strip.insertBefore(link, strip.firstChild);
}

// filter f-ns
function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0]; // RED
        pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
        pixels.data[i - 550] = pixels.data[i + 2]; // Blue
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach(input => {
        levels[input.name] = input.value;
    });

    for (i = 0; i < pixels.data.length; i = i + 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if (
            red >= levels.rmin &&
            green >= levels.gmin &&
            blue >= levels.bmin &&
            red <= levels.rmax &&
            green <= levels.gmax &&
            blue <= levels.bmax
        ) {
            // take it out!
            pixels.data[i + 3] = 0;
        }
    }

    return pixels;
}

// when you load it, you probably get a little pop-up here saying "localhost would like to access your camera".
getVideo();

video.addEventListener('canplay', paintToCanvas);
