// 固定逻辑分辨率：所有玩法坐标都以 1280 × 720 为基准。
export const LOGICAL_WIDTH = 1280;
export const LOGICAL_HEIGHT = 720;

// 固定时间步长主循环参数（秒）。
export const FIXED_STEP = 1 / 60;
export const MAX_FRAME_TIME = 0.1;

// 玩家物理与手感常量（第 6 节初稿，可在 T7 微调）。
export const PLAYER = {
  width: 40,
  height: 56,
  maxSpeed: 300,
  acceleration: 2400,
  friction: 2600,
  airAcceleration: 1700,
  airFriction: 400,
  jumpSpeed: 800,
};

export const PHYSICS = {
  gravity: 2200,
  maxFallSpeed: 1300,
};

export const COLORS = {
  skyTop: "#5eb6e8",
  skyMid: "#9bd8f2",
  skyBottom: "#dff3fb",
  grass: "#5fbf5a",
  grassDark: "#3f9a45",
  dirt: "#8a5a3b",
  dirtDark: "#6f452b",
};
