// 键盘输入：持续按下的状态 + 单次按键的边沿检测。
// 主循环每个固定步长结束时调用 endStep()，保证一次按下只触发一次动作。

const KEY_BINDINGS = {
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
  Space: "jump",
};

export function createInput(target = window) {
  const down = new Set();
  const pressed = new Set();

  function onKeyDown(event) {
    const action = KEY_BINDINGS[event.code];
    if (!action) {
      return;
    }

    event.preventDefault();
    if (!event.repeat && !down.has(action)) {
      pressed.add(action);
    }
    down.add(action);
  }

  function onKeyUp(event) {
    const action = KEY_BINDINGS[event.code];
    if (!action) {
      return;
    }

    event.preventDefault();
    down.delete(action);
  }

  function onBlur() {
    // 切走窗口时清空按键，避免回来后角色一直移动或补触发跳跃。
    down.clear();
    pressed.clear();
  }

  target.addEventListener("keydown", onKeyDown, { passive: false });
  target.addEventListener("keyup", onKeyUp, { passive: false });
  target.addEventListener("blur", onBlur);

  return {
    isDown(action) {
      return down.has(action);
    },

    wasPressed(action) {
      return pressed.has(action);
    },

    // 水平方向：-1 向左、0 静止、1 向右。
    horizontal() {
      const left = down.has("left") ? 1 : 0;
      const right = down.has("right") ? 1 : 0;
      return right - left;
    },

    endStep() {
      pressed.clear();
    },
  };
}
