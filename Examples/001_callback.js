// A callback function is usually used as a parameter to another function.
const second = () => {
    setTimeout(() => {
        console.log('download image takes 2 seconds');
    }, 2000);
};
const first = () => {
    console.log('first func was called');
    second();
    console.log('the code still running');
};
first();
