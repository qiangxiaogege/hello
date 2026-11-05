import { COLORS, LOGICAL_HEIGHT, LOGICAL_WIDTH } from "./config.js";
import { GROUND_TOP, WORLD_WIDTH } from "./level.js";

// T3 绘制完整关卡：天空、两层视差（远山 0.3×、云 0.5×）、
// 草地地面、砖石平台、边界石墙、原创小骑士。所有绘制减去相机偏移。

function drawSky(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, LOGICAL_HEIGHT);
  sky.addColorStop(0, COLORS.skyTop);
  sky.addColorStop(0.6, COLORS.skyMid);
  sky.addColorStop(1, COLORS.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
}

function drawHill(ctx, x, peakX, peakY, halfWidth) {
  ctx.beginPath();
  ctx.moveTo(x - halfWidth, GROUND_TOP + 8);
  ctx.quadraticCurveTo(peakX, peakY, x + halfWidth, GROUND_TOP + 8);
  ctx.closePath();
  ctx.fill();
}

function drawHills(ctx, cameraX) {
  const offset = -Math.round(cameraX * 0.3);

  ctx.save();
  ctx.translate(offset, 0);

  // 远山
  ctx.fillStyle = COLORS.hillFar;
  for (let x = -720; x < WORLD_WIDTH + 900; x += 440) {
    drawHill(ctx, x, x + 150, 380, 300);
  }

  // 近山
  ctx.fillStyle = COLORS.hillNear;
  for (let x = -520; x < WORLD_WIDTH + 900; x += 400) {
    drawHill(ctx, x, x + 120, 455, 250);
  }

  ctx.restore();
}

function drawCloud(ctx, x, y, scale) {
  ctx.beginPath();
  ctx.ellipse(x, y, 46 * scale, 17 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 36 * scale, y - 9 * scale, 28 * scale, 15 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 38 * scale, y + 4 * scale, 25 * scale, 12 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawClouds(ctx, cameraX) {
  const offset = -Math.round(cameraX * 0.5);
  const clouds = [
    [140, 110, 1],
    [470, 168, 0.8],
    [830, 92, 1.1],
    [1180, 150, 0.9],
    [1540, 104, 1],
    [1900, 166, 0.85],
    [2260, 118, 1.05],
    [2610, 158, 0.95],
    [2960, 100, 0.9],
  ];

  ctx.save();
  ctx.translate(offset, 0);
  ctx.fillStyle = COLORS.cloud;
  for (const [x, y, scale] of clouds) {
    drawCloud(ctx, x, y, scale);
  }
  ctx.restore();
}

function drawGround(ctx, ground) {
  ctx.fillStyle = COLORS.dirt;
  ctx.fillRect(ground.x, ground.y, ground.width, ground.height);

  // 泥土的浅色与深色斑块，避免大面积纯色。
  ctx.fillStyle = COLORS.dirtLight;
  for (let x = ground.x + 20; x < ground.x + ground.width; x += 96) {
    ctx.fillRect(x, ground.y + 44, 8, 18);
  }

  ctx.fillStyle = COLORS.dirtDark;
  for (let x = ground.x + 58; x < ground.x + ground.width; x += 120) {
    ctx.fillRect(x, ground.y + 66, 12, 14);
  }

  // 草皮
  ctx.fillStyle = COLORS.grass;
  ctx.fillRect(ground.x, ground.y, ground.width, 14);

  ctx.fillStyle = COLORS.grassLight;
  ctx.fillRect(ground.x, ground.y, ground.width, 3);

  ctx.fillStyle = COLORS.grassDark;
  for (let x = ground.x + 14; x < ground.x + ground.width; x += 28) {
    ctx.fillRect(x, ground.y + 3, 3, 8);
  }

  ctx.fillRect(ground.x, ground.y + 14, ground.width, 3);
}

function drawStonePlatform(ctx, platform) {
  ctx.fillStyle = COLORS.stoneDark;
  ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

  ctx.fillStyle = COLORS.stone;
  ctx.fillRect(platform.x + 2, platform.y + 2, platform.width - 4, platform.height - 4);

  ctx.fillStyle = COLORS.stoneLight;
  ctx.fillRect(platform.x + 2, platform.y + 2, platform.width - 4, 3);

  // 砖缝
  ctx.fillStyle = COLORS.stoneDark;
  ctx.fillRect(platform.x + 2, platform.y + 12, platform.width - 4, 2);
  for (let x = platform.x + 30; x < platform.x + platform.width - 2; x += 56) {
    ctx.fillRect(x, platform.y + 4, 2, 8);
    ctx.fillRect(x + 28, platform.y + 14, 2, 8);
  }

  // 平台顶部的一层青苔
  ctx.fillStyle = COLORS.grass;
  ctx.fillRect(platform.x, platform.y, platform.width, 3);

  ctx.fillStyle = COLORS.grassLight;
  ctx.fillRect(platform.x, platform.y, platform.width, 1);
}

function drawWall(ctx, wall) {
  ctx.fillStyle = COLORS.stoneShadow;
  ctx.fillRect(wall.x, wall.y, wall.width, wall.height);

  ctx.fillStyle = COLORS.stoneDark;
  for (let y = wall.y; y < wall.y + wall.height; y += 26) {
    const inset = (Math.floor((y - wall.y) / 26) % 2) * 3;
    ctx.fillRect(wall.x + 3 + inset, y, wall.width - 6 - inset, 23);
  }

  ctx.fillStyle = COLORS.stoneLight;
  ctx.fillRect(wall.x, wall.y, wall.width, 4);
}

function drawWorld(ctx, level) {
  for (const wall of level.walls) {
    drawWall(ctx, wall);
  }

  for (const platform of level.platforms) {
    if (platform.type === "ground") {
      drawGround(ctx, platform);
    } else {
      drawStonePlatform(ctx, platform);
    }
  }
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
  const cameraX = Math.round(game.camera.x);

  drawSky(ctx);
  drawHills(ctx, cameraX);
  drawClouds(ctx, cameraX);

  ctx.save();
  ctx.translate(-cameraX, 0);
  drawWorld(ctx, game.level);
  drawKnight(ctx, game.player);
  ctx.restore();
}
