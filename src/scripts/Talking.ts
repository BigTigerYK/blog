
import vh from 'vh-plugin'
import { fmtDate } from '@/utils/index'
import { $GET } from '@/utils/index'
// 图片懒加载
import vhLzImgInit from "@/scripts/vhLazyImg";

const TalkingInit = async (data: any) => {
  const talkingDOM = document.querySelector('.main-inner-content>.vh-tools-main>main.talking-main')
  if (!talkingDOM) return;
  try {
    let res = data;
    if (typeof data === 'string' && data) {
      res = await $GET(data);
    }
    if (!Array.isArray(res) || res.length === 0) {
      talkingDOM.innerHTML = '<p style="text-align:center;color:var(--vh-text-muted);padding:2rem 0;">暂无内容</p>';
      return;
    }
    talkingDOM.innerHTML = res.map((i: any) => `<article><header><img data-vh-lz-src="https://q1.qlogo.cn/g?b=qq&nk=1655466387&s=640" /><p class="info"><span>.𝙃𝙖𝙣</span><time>${fmtDate(i.date)}前</time></p></header><section class="main">${i.content}</section><footer>${i.tags.map((tag: any) => `<span>${tag}</span>`).join('')}</footer></article>`).join('');
    // 图片懒加载
    vhLzImgInit();
  } catch {
    vh.Toast('获取数据失败')
  }
}


// 动态说说初始化
import TALKING_DATA from "@/page_data/Talking";
const { api, data } = TALKING_DATA;
export default () => TalkingInit(api || data);