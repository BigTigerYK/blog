
// 初始化
export default () => {
  // 回顶部DOM
  const backTop: any = document.querySelector(".vh-back-top");
  // 彩虹圈圈 DOM
  const circle: any = document.querySelector(".vh-back-top>svg>circle");
  if (!backTop || !circle) return;
  const circumference = 2 * Math.PI * 10;

  // 滚动条高度变化事件
  const scrollChangeFn = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const percentage = (window.scrollY / (scrollHeight - clientHeight)) * 100;
    // 显示隐藏
    backTop.classList[percentage <= 0 ? "remove" : "add"]("active");
    // 进度为 不在范围内
    if (percentage < 0 || percentage > 100) return;
    // 进度不为 0
    circle.style.strokeDashoffset = circumference - (percentage / 100) * circumference;
  };

  // 返回顶部事件
  const backTopFn = () => {
    (window as any).vhlenis && (window as any).vhlenis.stop();
    window.scrollTo({ top: 0, behavior: "smooth" });
    (window as any).vhlenis && (window as any).vhlenis.start();
  };

  // BackTop 圈圈初始化
  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference;
  // 移除并添加BackTop 事件
  backTop.removeEventListener("click", backTopFn);
  backTop.addEventListener("click", backTopFn);
  // 移除并添加ScrollChange 事件
  window.removeEventListener("scroll", scrollChangeFn);
  window.addEventListener("scroll", scrollChangeFn);
  // 触发 scrollChangeFn
  scrollChangeFn();
};
