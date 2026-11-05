import { createEnemy, updateEnemies } from "./enemy.js";
import { createLevel, createCamera, updateCamera } from "./level.js";
import { createPlayer, updatePlayer } from "./player.js";

// 世界状态。T2 加入玩家，T3 加入相机，T4 加入 8 只蘑菇怪。
export function createGame() {
  const level = createLevel();
  const player = createPlayer(level.spawn.x, level.spawn.y);

  return {
    level,
    player,
    enemies: level.enemySpawns.map((spawn) => createEnemy(spawn)),
    camera: createCamera(),
    time: 0,
  };
}

export function updateGame(game, input, dt) {
  game.time += dt;
  updatePlayer(game.player, input, game.level, dt);
  updateEnemies(game.enemies, game.player, game.level, dt);
  updateCamera(game.camera, game.player, game.level, dt);
}
