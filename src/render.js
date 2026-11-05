import { COLORS, LOGICAL_HEIGHT, LOGICAL_WIDTH } from "./config.js";
import { GROUND_TOP } from "./level.js";

// T2 绘制天空、地面和一个原创像素风小骑士。
// T3 会加入视差背景、完整地形与相机偏移；T7 再统一打磨。

function drawSky(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, GROUND_TOP);
  sky.addColorStop(0, COLORS.skyTop);
  sky.addColorStop(0.6, COLORS.skyMid);
  sky.addColorStop(1, COLORS.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, LOGICAL_WIDTH, GROUND_TOP);
}

function drawGround(ctx, level) {
  const ground = level.platforms[0];
  const groundHeight = level.height - ground.y;

  ctx.fillStyle = COLORS.dirt;
  ctx.fillRect(ground.x, ground.y, ground.width, groundHeight);

  ctx.fillStyle = COLORS.grass;
  ctx.fillRect(ground.x, ground.y, ground.width, 10);

  ctx.fillStyle = COLORS.grassDark;
  ctx.fillRect(ground.x, ground.y + 10, ground.width, 6);

  ctx.fillStyle = COLORS.dirtDark;
  ctx.fillRect(
    ground.x,
    ground.y + 16,
    ground.width,
    Math.max(0, groundHeight - 16)
  );
}

function drawLeg(ctx, x, y, width, height) {
  ctx.fillStyle = "#243c63";
  ctx.fillRect(x, y, width, height);

  ctx.fillStyle = "#4a3223";
  ctx.fillRect(x - 1, y + height - 4, width + 2, 4);
}

// 原创小骑士占位角色：全部用基本图形绘制，不加载任何素材。
function drawKnight(ctx, player) {
  const walking = player.onGround && Math.abs(player.vx) > 10;
  const step = walking ? Math.sin(player.walkTime * 12) : 0;
  const legOffset = Math.round(step * 4);
  const armOffset = Math.round(-step * 3);
  const bob = walking ? Math.round(Math.abs(step)) : 0;
  const airborne = !player.onGround;

  ctx.save();
  ctx.translate(
    Math.round(player.x) + player.width / 2,
    Math.round(player.y) - bob
  );
  ctx.scale(player.facing, 1);
  ctx.translate(-player.width / 2, 0);

  if (!airborne) {
    ctx.fillStyle = "rgba(24, 39, 31, 0.18)";
    ctx.beginPath();
    ctx.ellipse(20, 56, 17, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 后手
  ctx.fillStyle = "#2f63aa";
  ctx.fillRect(4, 26 + armOffset, 6, 13);

  // 双腿（空中收腿）
  if (airborne) {
    drawLeg(ctx, 8, 36, 9, 15);
    drawLeg(ctx, 23, 38, 9, 13);
  } else {
    drawLeg(ctx, 8 + legOffset, 38, 9, 18);
    drawLeg(ctx, 23 - legOffset, 38, 9, 18);
  }

  // 躯干甲衣
  ctx.fillStyle = "#3f7fd1";
  ctx.fillRect(6, 21, 28, 21);

  ctx.fillStyle = "#2f63aa";
  ctx.fillRect(6, 38, 28, 4);

  // 腰带与扣子
  ctx.fillStyle = "#9a6428";
  ctx.fillRect(6, 35, 28, 5);
  ctx.fillStyle = "#f0c35a";
  ctx.fillRect(18, 34, 5, 7);

  // 肩甲
  ctx.fillStyle = "#a9cdf5";
  ctx.fillRect(3, 23, 9, 6);
  ctx.fillRect(28, 23, 9, 6);

  // 头部
  ctx.fillStyle = "#f3c89b";
  ctx.fillRect(10, 6, 20, 18);

  ctx.fillStyle = "#e0a878";
  ctx.fillRect(10, 21, 20, 3);

  // 头盔、护鼻与眼缝
  ctx.fillStyle = "#cdd9ea";
  ctx.fillRect(7, 2, 26, 10);
  ctx.fillStyle = "#eef5ff";
  ctx.fillRect(9, 2, 22, 3);
  ctx.fillStyle = "#8fa6c4";
  ctx.fillRect(9, 11, 22, 3);

  ctx.fillStyle = "#1c2633";
  ctx.fillRect(14, 15, 3, 3);
  ctx.fillRect(23, 15, 3, 3);

  // 红色盔缨，朝向上方
  ctx.fillStyle = "#e2574c";
  ctx.fillRect(17, 0, 7, 3);

  // 前手
  if (airborne) {
    ctx.fillStyle = "#356fbf";
    ctx.fillRect(30, 20, 7, 12);
    ctx.fillStyle = "#f3c89b";
    ctx.fillRect(30, 30, 7, 4);
  } else {
    ctx.fillStyle = "#356fbf";
    ctx.fillRect(30, 27 + armOffset, 7, 13);
    ctx.fillStyle = "#f3c89b";
    ctx.fillRect(30, 38 + armOffset, 7, 4);
  }

  ctx.restore();
}

export function render(ctx, game) {
  drawSky(ctx);
  drawGround(ctx, game.level);
  drawKnight(ctx, game.player);
}
