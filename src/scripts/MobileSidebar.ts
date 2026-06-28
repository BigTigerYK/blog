// 初始化侧边栏（防止 SPA 路由切换时重复绑定）
let sidebarInitialized = false;
export default () => {
  if (sidebarInitialized) return;
  const menuDOM: any = document.querySelector(".vh-header>.main>nav>span.menu-btn");
  const mobileSidebarDOM: any = document.querySelector("body>.vh-mobilesidebar");
  if (!menuDOM || !mobileSidebarDOM) return;
  sidebarInitialized = true;

  const getFocusableElements = () =>
    mobileSidebarDOM.querySelectorAll<HTMLElement>('a[href], button, input, [tabindex]:not([tabindex="-1"])');

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      removeActive();
      return;
    }
    if (e.key !== "Tab") return;
    const focusable = getFocusableElements();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const addActive = () => {
    mobileSidebarDOM.classList.add("active");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeydown);
    // 将焦点移到侧边栏内第一个可聚焦元素
    setTimeout(() => {
      const first = getFocusableElements()[0];
      if (first) first.focus();
    });
  };

  const removeActive = () => {
    mobileSidebarDOM.classList.remove("active");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleKeydown);
    // 恢复焦点到触发按钮
    menuDOM.focus();
  };

  menuDOM.addEventListener("click", addActive);
  mobileSidebarDOM.addEventListener("click", removeActive);
};
