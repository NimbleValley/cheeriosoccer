var tl = new TimelineMax();

var curtains = document.getElementsByClassName("curtain");

for (var i = 0; i < curtains.length; i++) {
    curtains[i].style.top = i * 20 + "vh";
    curtains[i].style.left = "100vw";
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function transition() {
    for (var i = 0; i < curtains.length; i++) {
        curtains[i].style.left = "0";
        await sleep(150);
    }
}

async function unTransition() {
    for (var i = 0; i < curtains.length; i++) {
        curtains[i].style.left = "100vw";
        await sleep(150);
    }
}

window.addEventListener('load', async function() {
    transition();
    await sleep(3000);
    unTransition();
});
