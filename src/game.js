import { createLevel, createCamera, updateCamera } from "./level.js";
import { createPlayer, updatePlayer } from "./player.js";

// 世界状态。T2 只有关卡与玩家；T4 起加入敌人，T6 起加入胜负状态。
export function createGame() {
  const level = createLevel();
  const player = createPlayer(level.spawn.x, level.spawn.y);

  return {
    level,
    player,
    camera: createCamera(),
    time: 0,
  };
}

export function updateGame(game, input, dt) {
  game.time += dt;
  updatePlayer(game.player, input, game.level, dt);
  updateCamera(game.camera, game.player, game.level, dt);
}
