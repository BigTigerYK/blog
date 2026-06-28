
import vh from 'vh-plugin';
import { fmtDate } from '@/utils/index'
import { $GET } from '@/utils/index'
// 图片懒加载
import vhLzImgInit from "@/scripts/vhLazyImg";

const FriendsInit = async (api: any) => {
	const friendsDOM = document.querySelector('.main-inner-content>.vh-tools-main>main.friends-main')
	if (!friendsDOM) return;
	try {
		let res = api;
		if (typeof api === 'string' && api) {
			res = await $GET(api);
		}
		if (!Array.isArray(res) || res.length === 0) {
			friendsDOM.innerHTML = '<p style="text-align:center;color:var(--vh-text-muted);padding:2rem 0;">暂无内容</p>';
			return;
		}
		friendsDOM.innerHTML = res.map((i: any) => `<article><a href="${i.link}" target="_blank" rel="noopener nofollow"><header><h2>${i.title}</h2></header><p class="vh-ellipsis line-2">${i.content}</p><footer><span><img src="https://icon.bqb.cool/?url=${i.link.split('//')[1].split('/')[0]}" /><em class="vh-ellipsis">${i.auther}</em></span><time>${fmtDate(i.date, false)}前</time></footer></a></article>`).join('');
		// 图片懒加载
		vhLzImgInit();
	} catch {
		vh.Toast('获取数据失败')
	}
}

// 朋友圈 RSS 初始化
import FRIENDS_DATA from "@/page_data/Friends";
const { api, data } = FRIENDS_DATA;
export default () => FriendsInit(api || data);