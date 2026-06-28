type EventHandler = (event: Event) => void;

// Store references for remove-before-add to prevent listener accumulation
let currentInHandler: EventHandler | null = null;
let currentOutHandler: EventHandler | null = null;

// 进入页面时触发（首次加载 + 每次 ViewTransition 导航完成后）
const inRouter = (handler: EventHandler) => {
  if (currentInHandler) document.removeEventListener("astro:page-load", currentInHandler);
  currentInHandler = handler;
  document.addEventListener("astro:page-load", handler);
};

// 离开当前页面时触发（ViewTransition swap 之前）
const outRouter = (handler: EventHandler) => {
  if (currentOutHandler) document.removeEventListener("astro:before-swap", currentOutHandler);
  currentOutHandler = handler;
  document.addEventListener("astro:before-swap", handler);
};

export { inRouter, outRouter };
