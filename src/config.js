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

// 蘑菇怪：巡逻/追击速度、发现距离与生命值（第 6 节初稿）。
export const ENEMY = {
  width: 44,
  height: 44,
  maxHp: 3,
  patrolSpeed: 55,
  chaseSpeed: 110,
  detectRange: 340,
};

export const PHYSICS = {
  gravity: 2200,
  maxFallSpeed: 1300,
};

// 相机：水平跟随玩家，带少量前瞻，并钳制在关卡范围内。
export const CAMERA = {
  lookahead: 110,
  followSpeed: 8,
};

export const COLORS = {
  skyTop: "#5eb6e8",
  skyMid: "#9bd8f2",
  skyBottom: "#dff3fb",
  hillFar: "#8fd0ad",
  hillNear: "#63b483",
  cloud: "#f4fbff",
  grass: "#5fbf5a",
  grassDark: "#3f9a45",
  grassLight: "#88d96b",
  dirt: "#8a5a3b",
  dirtDark: "#6f452b",
  dirtLight: "#a06a44",
  stone: "#94a0b4",
  stoneLight: "#c3ccda",
  stoneDark: "#6b778c",
  stoneShadow: "#59647a",
  mushroomCap: "#d9534f",
  mushroomSpot: "#fff4d6",
  mushroomBody: "#f4dfb2",
  mushroomBodyDark: "#d1b585",
  mushroomFeet: "#6b4630",
  outline: "#3a2620",
};
