import { ATTACK, COLORS, LOGICAL_HEIGHT, LOGICAL_WIDTH } from "./config.js";
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

// 近战挥砍：前摇抬剑、命中帧前挥、收招下压。判定框与剑身同期生效。
function drawSword(ctx, player) {
  if (player.attackTimer < 0) {
    return;
  }

  const t = player.attackTimer;
  let angle;
  if (t < ATTACK.hitStart) {
    angle = -2.1 + (t / ATTACK.hitStart) * 0.9;
  } else if (t <= ATTACK.hitEnd) {
    angle =
      -1.2 +
      ((t - ATTACK.hitStart) / (ATTACK.hitEnd - ATTACK.hitStart)) * 1.0;
  } else {
    angle =
      -0.2 +
      ((t - ATTACK.hitEnd) / (ATTACK.duration - ATTACK.hitEnd)) * 1.2;
  }

  ctx.save();
  ctx.translate(28, 30);
  ctx.rotate(angle);

  ctx.fillStyle = "#5a4636";
  ctx.fillRect(-7, -3, 9, 6);
  ctx.fillStyle = "#dfe8f5";
  ctx.fillRect(2, -3, 58, 6);
  ctx.fillStyle = "#f7fbff";
  ctx.fillRect(2, -3, 58, 2);
  ctx.fillStyle = "#9fb0c6";
  ctx.fillRect(60, -2, 5, 4);

  ctx.restore();
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

  drawSword(ctx, player);

  ctx.restore();
}

// 原创蘑菇怪：红伞白点、米色身体，全部用基本图形绘制。
function drawMushroom(ctx, enemy) {
  const chasing = enemy.state === "chase";
  const walking = enemy.onGround && Math.abs(enemy.vx) > 1;
  const step = walking ? Math.sin(enemy.animTime * (chasing ? 16 : 10)) : 0;
  const bob = walking ? Math.round(Math.abs(step)) : 0;
  const legOffset = Math.round(step * 2);
  const flash = enemy.hitFlash > 0;
  const cap = flash ? "#ffffff" : COLORS.mushroomCap;
  const body = flash ? "#fff6ea" : COLORS.mushroomBody;
  const bodyDark = flash ? "#ffe9d0" : COLORS.mushroomBodyDark;
  const outline = flash ? "#d9b9a8" : COLORS.outline;

  ctx.save();
  ctx.translate(
    Math.round(enemy.x) + enemy.width / 2,
    Math.round(enemy.y) - bob
  );
  ctx.scale(enemy.facing, 1);
  ctx.translate(-enemy.width / 2, 0);

  if (enemy.onGround) {
    ctx.fillStyle = "rgba(24, 39, 31, 0.18)";
    ctx.beginPath();
    ctx.ellipse(22, 44, 16, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 双脚
  ctx.fillStyle = flash ? "#eeeeee" : COLORS.mushroomFeet;
  ctx.fillRect(9 + legOffset, 38, 9, 6);
  ctx.fillRect(26 - legOffset, 38, 9, 6);

  // 身体与脸
  ctx.fillStyle = outline;
  ctx.fillRect(9, 18, 26, 23);
  ctx.fillStyle = body;
  ctx.fillRect(11, 20, 22, 18);
  ctx.fillStyle = bodyDark;
  ctx.fillRect(11, 34, 22, 4);

  ctx.fillStyle = "#2c1f1a";
  ctx.fillRect(15, 25, 4, 5);
  ctx.fillRect(25, 25, 4, 5);
  ctx.fillRect(20, 32, 4, 2);

  // 伞盖描边与伞面
  ctx.fillStyle = outline;
  ctx.fillRect(3, 11, 38, 13);
  ctx.fillRect(7, 7, 30, 6);
  ctx.fillRect(12, 3, 20, 5);

  ctx.fillStyle = cap;
  ctx.fillRect(5, 12, 34, 10);
  ctx.fillRect(9, 8, 26, 5);
  ctx.fillRect(14, 4, 16, 4);

  // 白色斑点
  ctx.fillStyle = flash ? "#ffffff" : COLORS.mushroomSpot;
  ctx.fillRect(9, 10, 7, 6);
  ctx.fillRect(25, 8, 7, 6);
  ctx.fillRect(32, 15, 5, 4);

  // 伞盖下沿
  ctx.fillStyle = outline;
  ctx.fillRect(5, 21, 34, 2);

  ctx.restore();
}

function drawHeart(ctx, x, y, filled) {
  ctx.fillStyle = filled ? "#e5544b" : "rgba(20, 30, 42, 0.45)";
  ctx.fillRect(x + 4, y, 6, 3);
  ctx.fillRect(x + 14, y, 6, 3);
  ctx.fillRect(x, y + 3, 24, 9);
  ctx.fillRect(x + 3, y + 12, 18, 5);
  ctx.fillRect(x + 7, y + 17, 10, 3);

  if (filled) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.fillRect(x + 5, y + 3, 4, 3);
  }
}

function drawHud(ctx, game) {
  for (let i = 0; i < game.player.maxHearts; i += 1) {
    drawHeart(ctx, 28 + i * 30, 24, i < game.player.hearts);
  }
}

function drawParticles(ctx, particles) {
  for (const particle of particles) {
    ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
    ctx.fillStyle = particle.color;
    ctx.fillRect(
      Math.round(particle.x - particle.size / 2),
      Math.round(particle.y - particle.size / 2),
      particle.size,
      particle.size
    );
  }
  ctx.globalAlpha = 1;
}

export function render(ctx, game) {
  const cameraX = Math.round(game.camera.x);

  drawSky(ctx);
  drawHills(ctx, cameraX);
  drawClouds(ctx, cameraX);

  ctx.save();
  ctx.translate(-cameraX, 0);
  drawWorld(ctx, game.level);
  for (const enemy of game.enemies) {
    if (enemy.alive) {
      drawMushroom(ctx, enemy);
    }
  }

  const flicker =
    game.player.invuln > 0 && Math.floor(game.player.invuln * 16) % 2 === 0;
  if (!flicker) {
    drawKnight(ctx, game.player);
  }

  drawParticles(ctx, game.particles);
  ctx.restore();

  drawHud(ctx, game);
}
