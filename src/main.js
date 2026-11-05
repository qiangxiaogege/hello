import {
  FIXED_STEP,
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  MAX_FRAME_TIME,
} from "./config.js";
import { render } from "./render.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

let accumulator = 0;
let lastTime = 0;
let frameId = 0;

// T1 还是空的世界更新；T2 起在这里推进玩家与环境状态。
// 固定步长保证不同刷新率下的手感一致。
function update(_dt) {
  // 后续任务填充。
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

  render(ctx);
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
