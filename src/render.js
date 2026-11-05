import {
  COLORS,
  GROUND_TOP,
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
} from "./config.js";

// T1 只绘制占位场景：天空渐变和一条地面。
// T3 会在此基础上加入视差背景、完整地形与相机偏移。

function drawSky(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, GROUND_TOP);
  sky.addColorStop(0, COLORS.skyTop);
  sky.addColorStop(0.6, COLORS.skyMid);
  sky.addColorStop(1, COLORS.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, LOGICAL_WIDTH, GROUND_TOP);
}

function drawGround(ctx) {
  const groundHeight = LOGICAL_HEIGHT - GROUND_TOP;

  ctx.fillStyle = COLORS.dirt;
  ctx.fillRect(0, GROUND_TOP, LOGICAL_WIDTH, groundHeight);

  ctx.fillStyle = COLORS.grass;
  ctx.fillRect(0, GROUND_TOP, LOGICAL_WIDTH, 10);

  ctx.fillStyle = COLORS.grassDark;
  ctx.fillRect(0, GROUND_TOP + 10, LOGICAL_WIDTH, 6);

  ctx.fillStyle = COLORS.dirtDark;
  ctx.fillRect(0, GROUND_TOP + 16, LOGICAL_WIDTH, groundHeight - 16);
}

export function render(ctx) {
  drawSky(ctx);
  drawGround(ctx);
}
