// 专注模式
const ZEN_MODE_KEY = 'vh-zen-mode';

const getZenState = (): boolean => localStorage.getItem(ZEN_MODE_KEY) === 'true';
const setZenState = (state: boolean) => localStorage.setItem(ZEN_MODE_KEY, String(state));

const applyZenMode = (enabled: boolean) => {
  document.documentElement.classList.toggle('vh-zen-mode', enabled);
  const btn = document.querySelector('.vh-zen-btn');
  if (btn) {
    btn.setAttribute('aria-label', enabled ? '退出专注模式' : '进入专注模式');
    btn.setAttribute('title', enabled ? '退出专注模式 (Ctrl+J)' : '专注模式 (Ctrl+J)');
  }
};

const toggleZenMode = () => {
  const next = !getZenState();
  setZenState(next);
  applyZenMode(next);
};

export default () => {
  // 恢复上次状态
  applyZenMode(getZenState());

  // 按钮点击
  document.querySelector('.vh-zen-btn')?.addEventListener('click', toggleZenMode);

  // Ctrl+J 快捷键
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
      e.preventDefault();
      toggleZenMode();
    }
  });
};
