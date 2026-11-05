import { ATTACK, COLORS, PLAYER } from "./config.js";
import { createEnemy, damageEnemy, updateEnemies } from "./enemy.js";
import { createLevel, createCamera, updateCamera } from "./level.js";
import {
  createPlayer,
  getAttackBox,
  isAttackActive,
  updatePlayer,
} from "./player.js";

function overlaps(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function countAlive(enemies) {
  return enemies.reduce((total, enemy) => total + (enemy.alive ? 1 : 0), 0);
}

function spawnDeathParticles(game, enemy) {
  for (let i = 0; i < 12; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 60 + Math.random() * 160;
    const life = 0.5 + Math.random() * 0.3;

    game.particles.push({
      x: enemy.x + enemy.width / 2,
      y: enemy.y + enemy.height / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 140,
      life,
      maxLife: life,
      size: 2 + Math.floor(Math.random() * 4),
      color: i % 3 === 0 ? COLORS.mushroomSpot : COLORS.mushroomCap,
    });
  }
}

function updateParticles(game, dt) {
  for (const particle of game.particles) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += 900 * dt;
    particle.life -= dt;
  }

  game.particles = game.particles.filter((particle) => particle.life > 0);
}

// 攻击判定与玩家接触伤害。每段攻击对同一只敌人只结算一次。
function updateCombat(game) {
  const { player, enemies } = game;

  if (isAttackActive(player)) {
    const attackBox = getAttackBox(player);

    for (const enemy of enemies) {
      if (!enemy.alive || player.attackHits.has(enemy)) {
        continue;
      }

      if (!overlaps(attackBox, enemy)) {
        continue;
      }

      player.attackHits.add(enemy);
      const direction =
        Math.sign(
          enemy.x +
            enemy.width / 2 -
            (player.x + player.width / 2)
        ) || player.facing;

      if (damageEnemy(enemy, direction, ATTACK.damage)) {
        spawnDeathParticles(game, enemy);
      }
    }
  }

  if (player.dead || player.invuln > 0) {
    return;
  }

  for (const enemy of enemies) {
    if (!enemy.alive || !overlaps(player, enemy)) {
      continue;
    }

    player.hearts = Math.max(0, player.hearts - 1);
    player.invuln = PLAYER.invulnTime;

    const direction =
      player.x + player.width / 2 < enemy.x + enemy.width / 2 ? -1 : 1;
    player.vx = direction * PLAYER.hurtKnockback;
    player.vy = -PLAYER.hurtLift;
    player.onGround = false;

    if (player.hearts <= 0) {
      player.dead = true;
    }
    break;
  }
}

function resetRun(game) {
  const level = game.level;

  game.player = createPlayer(level.spawn.x, level.spawn.y);
  game.enemies = level.enemySpawns.map((spawn) => createEnemy(spawn));
  game.particles = [];
  game.camera = createCamera();
  game.time = 0;
  game.portalActive = false;
  game.state = "playing";
}

// 开始界面：等待 Enter 或点击。开始后重置整局，不刷新页面。
export function startGame(game) {
  if (game.state === "start") {
    resetRun(game);
  }
}

// 胜利/失败后重开：同样只重置本局状态。
export function restartGame(game) {
  if (game.state === "won" || game.state === "lost") {
    resetRun(game);
  }
}

// 世界状态与流程：start → playing → won / lost → playing。
export function createGame() {
  const level = createLevel();
  const game = {
    level,
    player: null,
    enemies: [],
    particles: [],
    camera: createCamera(),
    time: 0,
    state: "start",
    portalActive: false,
  };

  resetRun(game);
  game.state = "start";
  return game;
}

export function updateGame(game, input, dt) {
  if (game.state === "start") {
    if (input.wasPressed("start")) {
      startGame(game);
    }
    return;
  }

  if (game.state === "won" || game.state === "lost") {
    if (input.wasPressed("start") || input.wasPressed("restart")) {
      restartGame(game);
    }
    return;
  }

  game.time += dt;
  updatePlayer(game.player, input, game.level, dt);
  updateEnemies(game.enemies, game.player, game.level, dt);
  updateCombat(game);
  updateParticles(game, dt);
  updateCamera(game.camera, game.player, game.level, dt);

  game.portalActive = countAlive(game.enemies) === 0;

  if (game.portalActive && overlaps(game.player, game.level.portal)) {
    game.state = "won";
  } else if (game.player.dead) {
    game.state = "lost";
  }
}

export function getRemainingEnemies(game) {
  return countAlive(game.enemies);
}
