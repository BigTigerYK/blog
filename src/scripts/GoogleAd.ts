
// 声明全局变量 adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
export default () => {
  const ads = document.querySelectorAll('.vh-ad ins.adsbygoogle');
  if (!ads.length) return;
  ads.forEach(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  });
}
