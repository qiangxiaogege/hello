import { ENEMY, PHYSICS } from "./config.js";

const EPSILON = 0.001;

export function createEnemy(spawn) {
  return {
    x: spawn.x,
    y: spawn.y - ENEMY.height,
    width: ENEMY.width,
    height: ENEMY.height,
    vx: 0,
    vy: 0,
    facing: spawn.facing ?? 1,
    onGround: false,
    state: "patrol",
    hp: ENEMY.maxHp,
    maxHp: ENEMY.maxHp,
    alive: true,
    hitFlash: 0,
    animTime: 0,
  };
}

function overlapsHorizontally(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x;
}

// 在前进方向脚下探一小段，没有平台就掉头，保证不会走下平台。
function hasGroundAhead(enemy, level, direction) {
  const probeX = direction > 0 ? enemy.x + enemy.width + 2 : enemy.x - 2;
  const feetY = enemy.y + enemy.height;

  return level.platforms.some(
    (platform) =>
      probeX >= platform.x &&
      probeX <= platform.x + platform.width &&
      feetY >= platform.y - 4 &&
      feetY <= platform.y + 4
  );
}

export function updateEnemy(enemy, player, level, dt) {
  if (!enemy.alive) {
    return;
  }

  enemy.animTime += dt;
  if (enemy.hitFlash > 0) {
    enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
  }

  const dx = player.x + player.width / 2 - (enemy.x + enemy.width / 2);
  const dy = player.y + player.height / 2 - (enemy.y + enemy.height / 2);
  const distance = Math.hypot(dx, dy);
  const chasing =
    !player.dead && distance <= ENEMY.detectRange && Math.abs(dx) > 4;

  enemy.state = chasing ? "chase" : "patrol";

  let direction;
  if (chasing) {
    direction = Math.sign(dx);
    enemy.facing = direction;
  } else {
    direction = enemy.facing;
  }

  if (enemy.onGround && direction !== 0 && !hasGroundAhead(enemy, level, direction)) {
    if (chasing) {
      // 追击到平台边缘时停在边缘，不跳下平台。
      direction = 0;
    } else {
      enemy.facing = -enemy.facing;
      direction = enemy.facing;
    }
  }

  const speed = chasing ? ENEMY.chaseSpeed : ENEMY.patrolSpeed;
  enemy.vx = direction * speed;

  enemy.x += enemy.vx * dt;
  const minX = level.bounds.minX;
  const maxX = level.bounds.maxX - enemy.width;
  if (enemy.x < minX) {
    enemy.x = minX;
    enemy.facing = 1;
  } else if (enemy.x > maxX) {
    enemy.x = maxX;
    enemy.facing = -1;
  }

  enemy.vy = Math.min(enemy.vy + PHYSICS.gravity * dt, PHYSICS.maxFallSpeed);
  const previousBottom = enemy.y + enemy.height;
  enemy.y += enemy.vy * dt;
  enemy.onGround = false;

  for (const platform of level.platforms) {
    if (!overlapsHorizontally(enemy, platform)) {
      continue;
    }

    const bottom = enemy.y + enemy.height;
    if (
      enemy.vy >= 0 &&
      previousBottom <= platform.y + EPSILON &&
      bottom >= platform.y
    ) {
      enemy.y = platform.y - enemy.height;
      enemy.vy = 0;
      enemy.onGround = true;
    }
  }
}

export function updateEnemies(enemies, player, level, dt) {
  for (const enemy of enemies) {
    updateEnemy(enemy, player, level, dt);
  }
}
