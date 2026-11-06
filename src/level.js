import { CAMERA, LOGICAL_HEIGHT, LOGICAL_WIDTH } from "./config.js";

// 2560 宽的横向卷轴关卡：一条地面 + P1–P5 五个平台（PLAN 第 4.2 节）。
// 左右各有一段石墙作为不可穿越的边界。
export const GROUND_TOP = 620;
export const WORLD_WIDTH = 2560;
export const WALL_WIDTH = 24;

export const LEVEL = {
  width: WORLD_WIDTH,
  height: LOGICAL_HEIGHT,
  spawn: { x: 120, y: GROUND_TOP },
  bounds: { minX: WALL_WIDTH, maxX: WORLD_WIDTH - WALL_WIDTH },
  platforms: [
    {
      type: "ground",
      x: 0,
      y: GROUND_TOP,
      width: WORLD_WIDTH,
      height: LOGICAL_HEIGHT - GROUND_TOP,
    },
    { type: "stone", x: 420, y: 500, width: 280, height: 24 },
    { type: "stone", x: 900, y: 500, width: 280, height: 24 },
    { type: "stone", x: 1380, y: 500, width: 280, height: 24 },
    { type: "stone", x: 1200, y: 390, width: 160, height: 24 },
    { type: "stone", x: 1840, y: 500, width: 260, height: 24 },
  ],
  enemySpawns: [
    { x: 300, y: GROUND_TOP },
    { x: 650, y: GROUND_TOP },
    { x: 1000, y: 500 },
    { x: 1250, y: 390 },
    { x: 1300, y: GROUND_TOP },
    { x: 1900, y: GROUND_TOP },
    { x: 2300, y: GROUND_TOP },
    { x: 2420, y: GROUND_TOP },
  ],
  portal: {
    x: 2460,
    y: GROUND_TOP - 112,
    width: 72,
    height: 112,
  },
  walls: [
    { x: 0, y: GROUND_TOP - 130, width: WALL_WIDTH, height: 130 },
    {
      x: WORLD_WIDTH - WALL_WIDTH,
      y: GROUND_TOP - 130,
      width: WALL_WIDTH,
      height: 130,
    },
  ],
};

export function createLevel() {
  return LEVEL;
}

export function createCamera() {
  return { x: 0 };
}

// 让玩家保持在画面中央附近，面朝方向带一点前瞻。
export function updateCamera(camera, player, level, dt) {
  const target =
    player.x +
    player.width / 2 -
    LOGICAL_WIDTH / 2 +
    player.facing * CAMERA.lookahead;
  const clamped = Math.max(0, Math.min(level.width - LOGICAL_WIDTH, target));
  const smoothing = 1 - Math.exp(-CAMERA.followSpeed * dt);

  camera.x += (clamped - camera.x) * smoothing;
  if (Math.abs(clamped - camera.x) < 0.05) {
    camera.x = clamped;
  }
}
