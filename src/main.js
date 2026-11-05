import {
  FIXED_STEP,
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  MAX_FRAME_TIME,
} from "./config.js";
import { createGame, updateGame } from "./game.js";
import { createInput } from "./input.js";
import { render } from "./render.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

const input = createInput();
const game = createGame();

let accumulator = 0;
let lastTime = 0;
let frameId = 0;

// 固定步长推进世界，保证不同刷新率下手感一致。
function update(dt) {
  updateGame(game, input, dt);
  input.endStep();
}

function frame(now) {
  let frameTime = (now - lastTime) / 1000;
  lastTime = now;

  if (frameTime < 0) {
    frameTime = 0;
  }
  // 切回标签页或长时间卡顿时不补跑大量逻辑帧。
  if (frameTime > MAX_FRAME_TIME) {
    frameTime = MAX_FRAME_TIME;
  }

  accumulator += frameTime;
  while (accumulator >= FIXED_STEP) {
    update(FIXED_STEP);
    accumulator -= FIXED_STEP;
  }

  render(ctx, game);
  frameId = requestAnimationFrame(frame);
}

function startLoop() {
  cancelAnimationFrame(frameId);
  lastTime = performance.now();
  accumulator = 0;
  frameId = requestAnimationFrame(frame);
}

function stopLoop() {
  cancelAnimationFrame(frameId);
}

function handleVisibilityChange() {
  if (document.hidden) {
    stopLoop();
  } else {
    startLoop();
  }
}

function resizeCanvas() {
  const scale = Math.min(
    window.innerWidth / LOGICAL_WIDTH,
    window.innerHeight / LOGICAL_HEIGHT
  );

  canvas.style.width = `${LOGICAL_WIDTH * scale}px`;
  canvas.style.height = `${LOGICAL_HEIGHT * scale}px`;
}

window.addEventListener("resize", resizeCanvas);
document.addEventListener("visibilitychange", handleVisibilityChange);

resizeCanvas();
startLoop();
