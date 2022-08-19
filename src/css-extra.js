const PATH = "./assets/css_extras/"

// Fixes visual glitches that occur when both input buttons are pressed and released
let blueKeysPressed = [false, false]; 
let redKeysPressed = [false, false]; 

document.addEventListener('keydown', (event)=>{
  // Blue player
  if(event.code == "KeyA"){
    changeImg("blue-stick", "blueStickLeft");
    blueKeysPressed[0] = true;
  }
  if(event.code == "KeyD"){
    changeImg("blue-stick", "blueStickRight");
    blueKeysPressed[1] = true;
  }
  if (event.code == "KeyF") changeImg("blue-button", "blueButtonPressed");

  // Red player
  if(event.code == "ArrowLeft"){
    changeImg("red-stick", "redStickLeft");
    redKeysPressed[0] = true;
  }
  if(event.code == "ArrowRight"){
    changeImg("red-stick", "redStickRight");
    redKeysPressed[1] = true;
  }
  if(event.code == "Enter") changeImg("red-button", "redButtonPressed");
}, true);

document.addEventListener('keyup', (event)=>{
  // Blue player
  if(event.code == "KeyA"){
    blueKeysPressed[0] = false;
    if(blueKeysPressed[0]==false && blueKeysPressed[1]==false) changeImg("blue-stick", "blueStickMid");
  }
  if(event.code == "KeyD"){
    blueKeysPressed[1] = false;
    if(blueKeysPressed[0]==false && blueKeysPressed[1]==false) changeImg("blue-stick", "blueStickMid");
  }
  if (event.code == "KeyF") changeImg("blue-button", "blueButtonIdle");

  // Red player
  if(event.code == "ArrowLeft"){
    redKeysPressed[0] = false;
    if(redKeysPressed[0]==false && redKeysPressed[1]==false) changeImg("red-stick", "redStickMid");
  }
  if(event.code == "ArrowRight"){
    redKeysPressed[1] = false;
    if(redKeysPressed[0]==false && redKeysPressed[1]==false) changeImg("red-stick", "redStickMid");
  }
  if (event.code == "Enter") changeImg("red-button", "redButtonIdle");
}, true);


function changeImg(target, img){
  document.getElementById(target).src = PATH + img + ".png";
}