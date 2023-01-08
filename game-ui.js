var tl = new TimelineMax();
var curtains = document.getElementsByClassName("curtain");

const scoreboardText = document.getElementById("score-text");

for (var i = 0; i < curtains.length; i++) {
    curtains[i].style.top = i * 20 + "vh";
    curtains[i].style.left = "100vw";
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function transition() {
    playable = false;
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
    await sleep(500);
    playable = true;
}

window.addEventListener('load', async function() {
    playable = true;
    //transition();
    await sleep(3000);
    unTransition();
});

async function updateScore(p1, p2) {
    scoreboardText.textContent = `${p1} - ${p2}`;
}