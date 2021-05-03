// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

// canvas elements
var canvas = document.getElementById('user-image');
var context = canvas.getContext('2d'); 

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  context.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
 
  // fill canvas with  black borders for non-square images
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // draw image to cavnas
  let dimensions = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  let startx = dimensions.startX,
    starty = dimensions.startY,
    width = dimensions.width,
    height = dimensions.height;
  context.drawImage(img, startx, starty, width, height);

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

// input: image=input
var imageInput = document.getElementById('image-input');

imageInput.addEventListener('change', () => {
  img.src = URL.createObjectURL(imageInput.files[0]);
  img.alt = imageInput.files[0];
});

// form: submit
const form = document.getElementById('generate-meme');
var buttons = document.querySelectorAll("button"); // button list 0. Generate 1. Clear 2. Read Text

form.addEventListener('submit', (event) => {
  // generate text
  var textTop = document.getElementById('text-top').value;
  var textBot = document.getElementById('text-bottom').value;
  context.fillStyle = 'white';
  context.font = "50px Impact";
  context.textBaseline = 'middle';
  context.textAlign = "center";
  context.fillText(textTop, 200, 30);
  context.fillText(textBot, 200, 370);
 
  event.preventDefault();
  
  // toggle buttons
  buttons[0].disabled = true; // disable Generate
  buttons[1].disabled = false; // enable Clear
  buttons[2].disabled = false; // enable Read Text


  event.preventDefault();
});

// button: clear
const clear = buttons[1]; 

clear.addEventListener('click', () => {
  context.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
  
  // toggle buttons
  buttons[0].disabled = false; // enable Generate
  buttons[1].disabled = true; // disable Clear
  buttons[2].disabled = true; // disable Read Text
});

// button: read text
const readText = buttons[2];
const voiceSelection = document.getElementById('voice-selection');
voiceSelection.disabled = false;
voiceSelection.remove(voiceSelection.options[0]);
var textTop = document.getElementById('text-top');
var textBot = document.getElementById('text-bottom'); 
var slider = document.getElementById('volume-group').querySelector('input');
var voices = [];

// sample code from mozilla.org
function populateVoiceList() {
  if(typeof speechSynthesis === 'undefined') {
    return;
  }

  voices = speechSynthesis.getVoices();

  for(var i = 0; i < voices.length; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    document.getElementById("voice-selection").appendChild(option);
  }
}

populateVoiceList();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

readText.addEventListener('click', () => {
  var msgTop = new SpeechSynthesisUtterance();
  msgTop.text = textTop.value;
  voices = speechSynthesis.getVoices();

  var selectedOption = document.getElementById("voice-selection").selectedOptions[0].getAttribute('data-name');
  for(var i = 0; i < voices.length; i++) {
    if(voices[i].name == selectedOption) {
      msgTop.voice = voices[i];
    }
  }

  msgTop.volume = slider.value / 100;
  window.speechSynthesis.speak(msgTop);

  var msgBot = new SpeechSynthesisUtterance();
  msgBot.text = textBot.value;
  voices = speechSynthesis.getVoices();

  var selectedOption = document.getElementById("voice-selection").selectedOptions[0].getAttribute('data-name');
  for(var i = 0; i < voices.length; i++) {
    if(voices[i].name == selectedOption) {
      msgBot.voice = voices[i];
    }
  }
  msgBot.volume = slider.value / 100;
  window.speechSynthesis.speak(msgBot);
});

// div: volume-group
var sliderImg = document.getElementById('volume-group').querySelector('img');

slider.addEventListener('input', () => {
  if (slider.value >= 67 && slider.value <= 100) {
    sliderImg.src = 'icons/volume-level-3.svg';
    sliderImg.alt = 'Volume Level 3';
  }

  if (slider.value >= 34 && slider.value <= 66) {
    sliderImg.src = 'icons/volume-level-2.svg';
    sliderImg.alt = 'Volume Level 2';
  }

  if (slider.value >= 1 && slider.value <= 33) {
    sliderImg.src = 'icons/volume-level-1.svg';
    sliderImg.alt = 'Volume Level 1';
  }

  if (slider.value == 0) {
    sliderImg.src = 'icons/volume-level-0.svg';
    sliderImg.alt = 'Volume Level 0';
  }

});


/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}

