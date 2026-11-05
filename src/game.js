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

// 世界状态。T2 玩家、T3 相机、T4 敌人、T5 战斗与生命值。
export function createGame() {
  const level = createLevel();
  const player = createPlayer(level.spawn.x, level.spawn.y);

  return {
    level,
    player,
    enemies: level.enemySpawns.map((spawn) => createEnemy(spawn)),
    particles: [],
    camera: createCamera(),
    time: 0,
  };
}

export function updateGame(game, input, dt) {
  game.time += dt;
  updatePlayer(game.player, input, game.level, dt);
  updateEnemies(game.enemies, game.player, game.level, dt);
  updateCombat(game);
  updateParticles(game, dt);
  updateCamera(game.camera, game.player, game.level, dt);
}
