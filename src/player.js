import { PHYSICS, PLAYER } from "./config.js";

const EPSILON = 0.001;

export function createPlayer(x, y) {
  return {
    x,
    y: y - PLAYER.height,
    width: PLAYER.width,
    height: PLAYER.height,
    vx: 0,
    vy: 0,
    facing: 1,
    onGround: false,
    walkTime: 0,
  };
}

// 水平加速/摩擦 → 起跳 → 重力 → 移动 → 平台顶部落地。
export function updatePlayer(player, input, level, dt) {
  const axis = input.horizontal();
  const targetSpeed = axis * PLAYER.maxSpeed;

  let acceleration;
  if (axis !== 0) {
    acceleration = player.onGround ? PLAYER.acceleration : PLAYER.airAcceleration;
  } else {
    acceleration = player.onGround ? PLAYER.friction : PLAYER.airFriction;
  }

  const speedDelta = targetSpeed - player.vx;
  const maxDelta = acceleration * dt;
  if (Math.abs(speedDelta) <= maxDelta) {
    player.vx = targetSpeed;
  } else {
    player.vx += Math.sign(speedDelta) * maxDelta;
  }

  if (axis !== 0) {
    player.facing = axis;
  }

  if (input.wasPressed("jump") && player.onGround) {
    player.vy = -PLAYER.jumpSpeed;
    player.onGround = false;
  }

  player.vy = Math.min(player.vy + PHYSICS.gravity * dt, PHYSICS.maxFallSpeed);

  player.x += player.vx * dt;
  const maxX = level.width - player.width;
  if (player.x < 0) {
    player.x = 0;
    player.vx = 0;
  } else if (player.x > maxX) {
    player.x = maxX;
    player.vx = 0;
  }

  const previousBottom = player.y + player.height;
  player.y += player.vy * dt;
  player.onGround = false;

  if (player.vy >= 0) {
    for (const platform of level.platforms) {
      const overlapsHorizontally =
        player.x + player.width > platform.x &&
        player.x < platform.x + platform.width;
      if (!overlapsHorizontally) {
        continue;
      }

      const bottom = player.y + player.height;
      if (
        previousBottom <= platform.y + EPSILON &&
        bottom >= platform.y
      ) {
        player.y = platform.y - player.height;
        player.vy = 0;
        player.onGround = true;
      }
    }
  }

  // 走路动画计时；落地后松开方向键会快速归零。
  if (player.onGround && Math.abs(player.vx) > 1) {
    player.walkTime += dt;
  } else if (player.onGround) {
    player.walkTime = 0;
  }
}
