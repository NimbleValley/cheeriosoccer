var tl = new TimelineMax();

const titleContainer = document.getElementById("title-container");
const menuContainer = document.getElementById("menu-container");

var titleText = "Cheerio Soccer";
var spans = [];
var red = true;

var curtains = document.getElementsByClassName("curtain");
for (var i = 0; i < curtains.length; i++) {
    curtains[i].style.top = i * 20 + "vh";
    curtains[i].style.left = "100vw";
}

for (var i = 0; i < titleText.length; i++) {
    var temp = document.createElement("span");
    temp.className = "title-span";
    temp.innerText = titleText[i];
    temp.style.textShadow = "0px 0px 2.5vh rgb(106, 169, 173)";
    temp.style.transitionDuration = "0.25s";
    spans.push(temp);
    titleContainer.appendChild(temp);
}


setInterval(async function () {
    for (var i = 0; i < spans.length; i++) {
        if (red) {
            spans[i].style.color = "rgb(233, 131, 106)";
            spans[i].style.textShadow = "0px 0px 2.5vh rgb(173, 106, 106)";
        } else {
            spans[spans.length - 1 - i].style.color = "rgb(132, 222, 250)";
            spans[spans.length - 1 - i].style.textShadow = "0px 0px 2.5vh rgb(106, 169, 173)";
        }
        await sleep(100);
    }
    red = !red;
}, 3000);

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function transition() {
    for (var i = 0; i < curtains.length; i++) {
        curtains[i].style.left = "0";
        await sleep(150);
    }
    setUpMenu();
}