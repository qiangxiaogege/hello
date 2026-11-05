import { LOGICAL_HEIGHT } from "./config.js";

// T2 只放一条地面；T3 会在 platforms 中加入 P1–P5 并扩展世界宽度。
export const GROUND_TOP = 620;
export const GROUND_HEIGHT = LOGICAL_HEIGHT - GROUND_TOP;

export const LEVEL = {
  width: 1280,
  height: LOGICAL_HEIGHT,
  spawn: { x: 120, y: GROUND_TOP },
  platforms: [
    {
      x: 0,
      y: GROUND_TOP,
      width: 1280,
      height: GROUND_HEIGHT,
    },
  ],
};

export function createLevel() {
  return LEVEL;
}
