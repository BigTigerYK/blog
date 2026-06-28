// 图片懒加载
import LazyLoad from "vanilla-lazyload";

// 初始化图片懒加载
let lazyLoadStatus: any = null;
export default () => {
  document.querySelectorAll(".main-inner>.main-inner-content img:not(.view-image-container), .vh-aside img:not(.view-image-container)").forEach((i: any) => {
    // 是否包含data-vh-lz-src
    if (!i.hasAttribute("data-vh-lz-src")) {
      i.setAttribute("data-vh-lz-src", i.getAttribute("src"));
      i.setAttribute("src", '/assets/images/lazy-loading.webp');
    }
  });
  // 销毁旧实例再重建，确保 SPA 页面切换后 IntersectionObserver 重新绑定新 DOM
  if (lazyLoadStatus) {
    lazyLoadStatus.destroy();
    lazyLoadStatus = null;
  }
  lazyLoadStatus = new LazyLoad({ elements_selector: "img:not(.view-image-container)", threshold: 0, data_src: "vh-lz-src" });
}