import { inRouter, outRouter } from "@/utils/updateRouter";
// Banner 打字效果
import TypeWriteInit from "@/scripts/TypeWrite";
// 泡泡🫧效果
import PaoPaoInit from "@/scripts/PaoPao";
// 初始化文章代码块
import codeInit from "@/scripts/Code";
// 初始化视频播放器
import videoInit from "@/scripts/Video";
// 初始化音乐播放器
import musicInit from "@/scripts/Music";
// 初始化 LivePhoto
import livePhotoInit from '@/scripts/LivePhoto'
// 初始化BackTop组件
import BackTopInitFn from "@/scripts/BackTop";
// 搜索
import { searchFn, vhSearchInit } from "@/scripts/Search";
// 图片懒加载
import vhLzImgInit from "@/scripts/vhLazyImg";
// 图片灯箱
import ViewImage from "@/scripts/ViewImage";
// 底部网站运行时间
import initWebSiteTime from "@/scripts/Footer";
// 友情链接初始化
import initLinks from "@/scripts/Links";
// 朋友圈 RSS 初始化
import initFriends from "@/scripts/Friends";
// 动态说说初始化
import initTalking from "@/scripts/Talking";
// 移动端侧边栏初始化
import initMobileSidebar from "@/scripts/MobileSidebar";
// Google 广告
import GoogleAdInit from "@/scripts/GoogleAd";
// Han Analytics 统计
import HanAnalyticsInit from "@/scripts/HanAnalytics";
//  谷歌 SEO 推送
import SeoPushInit from "@/scripts/SeoPush";
// SmoothScroll 滚动优化
import SmoothScroll from "@/scripts/Smoothscroll";
// TOC 动态高亮
import { tocInit, tocDestroy } from "@/scripts/Toc";
// 专注模式
import ZenModeInit from "@/scripts/ZenMode";
// 评论系统
import CommentInit, { commentDestroy } from "@/scripts/Comment";

// ============================================================

// 页面初始化 Only
const videoList: any[] = [];
const MusicList: any[] = [];
// 延迟加载模块（首次交互/滚动后才加载）
let deferredLoaded = false;
const loadDeferred = () => {
  if (deferredLoaded) return;
  deferredLoaded = true;
  GoogleAdInit();
  SeoPushInit();
  HanAnalyticsInit();
};

const indexInit = () => {
  // 初始化文章代码块
  codeInit();
  // 图片懒加载初始化
  vhLzImgInit();
  // 初始化 LivePhoto
  livePhotoInit();
  // 文章视频播放器初始化
  videoInit(videoList);
  // 文章音乐播放器初始化
  musicInit(MusicList);
  // 友情链接初始化
  initLinks();
  // 朋友圈 RSS 初始化
  initFriends();
  // 动态说说初始化
  initTalking();
  // 打字效果（每次路由进入都尝试初始化，内部防重复）
  TypeWriteInit();
  // 泡泡🫧效果
  PaoPaoInit();
  // 初始化搜索功能
  vhSearchInit();
  // 移动端侧边栏初始化
  initMobileSidebar();
  // TOC 动态高亮
  tocInit();
  // 评论系统
  CommentInit();
  // SPA 路由切换时立即加载延迟模块
  loadDeferred();
};

export default () => {
  // 一次性初始化（BackTop、SmoothScroll 等只执行一次）
  let onceDone = false;
  const initOnce = () => {
    if (onceDone) return;
    onceDone = true;
    initWebSiteTime();
    BackTopInitFn();
    SmoothScroll();
    ViewImage();
    searchFn("");
    ZenModeInit();
    const triggerLoad = () => {
      loadDeferred();
      window.removeEventListener('scroll', triggerLoad);
      window.removeEventListener('click', triggerLoad);
      window.removeEventListener('keydown', triggerLoad);
    };
    window.addEventListener('scroll', triggerLoad, { once: true, passive: true });
    window.addEventListener('click', triggerLoad, { once: true });
    window.addEventListener('keydown', triggerLoad, { once: true });
    setTimeout(loadDeferred, 8000);
  };
  // 首次初始化
  initOnce();
  indexInit();
  // 进入页面时触发（ViewTransition 导航完成后）
  inRouter(() => {
    initOnce();
    indexInit();
  });
  // 离开当前页面时触发
  outRouter(() => {
    // 重置延迟加载状态
    deferredLoaded = false;
    // 销毁播放器
    videoList.forEach((i: any) => i.destroy());
    videoList.length = 0;
    // 销毁音乐
    MusicList.forEach((i: any) => i.destroy());
    MusicList.length = 0;
    // 销毁 TOC observer
    tocDestroy();
    // 销毁评论系统定时器
    commentDestroy();
  });
  console.log("%c🌻 程序：Astro | 主题：vhAstro-Theme | 作者：Han | Github：https://github.com/uxiaohan/vhAstro-Theme 🌻", "color:#fff; background: linear-gradient(270deg, #18d7d3, #68b7dd, #8695e6, #986fee); padding: 8px 15px; border-radius: 8px");
  console.log("%c\u521D\u59CB\u5316\u5B8C\u6BD5.", "color: #ffffff; background: #000; padding:5px");
}