// audio.js
export const audio = {
  bg: new Audio("/sounds/background.mp3"),
  jump: new Audio("/sounds/jump.wav"),
  click: new Audio("/sounds/click.wav"),
};

audio.bg.loop = true;
audio.bg.volume = 0.4;
