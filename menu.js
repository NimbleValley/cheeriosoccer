const sliderThumb = document.getElementById("player-thumb");
const playerTwoSettings = document.getElementById("player-two-settings");
var singlePlayer = false;
const fader = document.getElementById("white-fader");

sliderThumb.style.left = "70%";

async function setUpMenu() {
    menuContainer.style.display = "block";

    var menuItems = document.getElementsByClassName("menu-item");

    for(var i = 0; i < menuItems.length; i ++) {
        menuItems[i].style.scale = 0.5;
        tl.to(menuItems[i], 1, {ease: Power2.easeOut, opacity: 1, scale: 1}, "-=0.75");
    }
}

async function togglePlayerNum() {
    singlePlayer = !singlePlayer;
    console.log(singlePlayer);
    if(singlePlayer) {
        sliderThumb.style.left = 0;
        tl = new TimelineMax();
        tl.to(playerTwoSettings, 0.75, {ease: Power2.easeOut, opacity: 0});
    } else {
        sliderThumb.style.left = "70%";
        tl = new TimelineMax();
        tl.to(playerTwoSettings, 0.75, {ease: Power2.easeOut, opacity: 1});
    }
}

async function whiteFade() {
    fader.style.display = "block";
    tl.to(fader, 1, {ease: Power2.easeOut, opacity: 1});
    await sleep(1000);
    open("game.html", "_self");
}