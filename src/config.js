// 固定逻辑分辨率：所有玩法坐标都以 1280 × 720 为基准。
export const LOGICAL_WIDTH = 1280;
export const LOGICAL_HEIGHT = 720;

// 固定时间步长主循环参数（秒）。
export const FIXED_STEP = 1 / 60;
export const MAX_FRAME_TIME = 0.1;

// 场景常量。当前只用于 T1 的占位天空与地面，T3 展开为完整关卡。
export const GROUND_TOP = 620;

export const COLORS = {
  skyTop: "#5eb6e8",
  skyMid: "#9bd8f2",
  skyBottom: "#dff3fb",
  grass: "#5fbf5a",
  grassDark: "#3f9a45",
  dirt: "#8a5a3b",
  dirtDark: "#6f452b",
};
