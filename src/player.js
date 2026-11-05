import { ATTACK, PHYSICS, PLAYER } from "./config.js";

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
    hearts: PLAYER.maxHearts,
    maxHearts: PLAYER.maxHearts,
    invuln: 0,
    attackTimer: -1,
    attackCooldown: 0,
    attackHits: new Set(),
    dead: false,
  };
}

export function isAttackActive(player) {
  return (
    player.attackTimer >= ATTACK.hitStart &&
    player.attackTimer <= ATTACK.hitEnd
  );
}

export function getAttackBox(player) {
  return {
    x: player.facing > 0 ? player.x + player.width : player.x - ATTACK.width,
    y: player.y + (player.height - ATTACK.height) / 2,
    width: ATTACK.width,
    height: ATTACK.height,
  };
}

function overlapsHorizontally(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x;
}

function overlaps(a, b) {
  return (
    overlapsHorizontally(a, b) &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// 先水平、后垂直的 AABB 碰撞；平台四边均可阻挡，顶部可站立。
export function updatePlayer(player, input, level, dt) {
  player.invuln = Math.max(0, player.invuln - dt);
  player.attackCooldown = Math.max(0, player.attackCooldown - dt);

  if (player.attackTimer >= 0) {
    player.attackTimer += dt;
    if (player.attackTimer >= ATTACK.duration) {
      player.attackTimer = -1;
    }
  }

  if (player.dead) {
    player.vx = 0;
    return;
  }

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

  if (input.wasPressed("attack") && player.attackCooldown <= 0) {
    player.attackTimer = 0;
    player.attackCooldown = ATTACK.cooldown;
    player.attackHits = new Set();
  }

  if (input.wasPressed("jump") && player.onGround) {
    player.vy = -PLAYER.jumpSpeed;
    player.onGround = false;
  }

  player.vy = Math.min(player.vy + PHYSICS.gravity * dt, PHYSICS.maxFallSpeed);

  // 水平移动，撞到平台侧面时贴边停下。
  player.x += player.vx * dt;
  for (const platform of level.platforms) {
    if (!overlaps(player, platform)) {
      continue;
    }

    if (player.vx > 0) {
      player.x = platform.x - player.width;
    } else if (player.vx < 0) {
      player.x = platform.x + platform.width;
    }
    player.vx = 0;
  }

  const minX = level.bounds.minX;
  const maxX = level.bounds.maxX - player.width;
  if (player.x < minX) {
    player.x = minX;
    player.vx = 0;
  } else if (player.x > maxX) {
    player.x = maxX;
    player.vx = 0;
  }

  // 垂直移动：下落时贴合平台顶部，上升时撞到底部停下。
  const previousTop = player.y;
  const previousBottom = player.y + player.height;
  player.y += player.vy * dt;
  player.onGround = false;

  for (const platform of level.platforms) {
    if (!overlapsHorizontally(player, platform)) {
      continue;
    }

    const bottom = player.y + player.height;
    if (
      player.vy >= 0 &&
      previousBottom <= platform.y + EPSILON &&
      bottom >= platform.y
    ) {
      player.y = platform.y - player.height;
      player.vy = 0;
      player.onGround = true;
    } else if (
      player.vy < 0 &&
      previousTop >= platform.y + platform.height - EPSILON &&
      player.y <= platform.y + platform.height
    ) {
      player.y = platform.y + platform.height;
      player.vy = 0;
    }
  }

  // 走路动画计时；落地后松开方向键会快速归零。
  if (player.onGround && Math.abs(player.vx) > 1) {
    player.walkTime += dt;
  } else if (player.onGround) {
    player.walkTime = 0;
  }
}
