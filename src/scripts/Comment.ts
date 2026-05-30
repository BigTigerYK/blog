/*
 * @Author: Han
 * @Date: 2025-04-07 11:31:34
 * @LastEditors: Han
 * @LastEditTime: 2025-04-21 14:32:19
 * @Description:
 *
 */
import SITE_INFO from "@/config";
import { LoadScript } from "@/utils/index";
declare const twikoo: any;

// Twikoo 评论
const TwikooFn = async (commentDOM: string) => {
  document.querySelector(commentDOM)!.innerHTML = '<section class="vh-space-loading"><span></span><span></span><span></span></section>'
  await LoadScript("https://registry.npmmirror.com/twikoo/1.6.41/files/dist/twikoo.all.min.js");
  twikoo.init({ envId: SITE_INFO.Comment.Twikoo.envId, el: commentDOM, onCommentLoaded: () => setTimeout(() => document.querySelectorAll('.vh-comment a[href="#"]').forEach(link => link.removeAttribute('href'))) })
}

// Waline 评论
const WalineFn = async (commentDOM: string, walineInit: any) => {
  import('@waline/client/waline.css');
  import('@waline/client/waline-meta.css');
  const { init } = await import('@waline/client');
  walineInit = init({
    el: commentDOM, path: window.location.pathname.replace(/\/$/, ''), serverURL: SITE_INFO.Comment.Waline.serverURL,
    emoji: ['https://registry.npmmirror.com/@waline/emojis/1.3.0/files/alus', 'https://registry.npmmirror.com/@waline/emojis/1.3.0/files/bilibili', 'https://registry.npmmirror.com/@waline/emojis/1.3.0/files/bmoji', 'https://registry.npmmirror.com/@waline/emojis/1.3.0/files/qq', 'https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba', 'https://registry.npmmirror.com/@waline/emojis/1.3.0/files/weibo', 'https://registry.npmmirror.com/@waline/emojis/1.3.0/files/soul-emoji'],
    reaction: [
      "https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba/tieba_agree.png",
      "https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba/tieba_look_down.png",
      "https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba/tieba_sunglasses.png",
      "https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba/tieba_pick_nose.png",
      "https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba/tieba_awkward.png",
      "https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba/tieba_sleep.png",
    ],
    requiredMeta: ['nick', 'mail'],
    imageUploader: async (file: any) => {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch("https://wp-cdn.4ce.cn/upload", { method: "POST", body });
      const resJson = await res.json();
      return resJson.data.link.replace('i.imgur.com', 'wp-cdn.4ce.cn/v2');
    }
  });
}

// Giscus 评论（基于 GitHub Discussions）
const GiscusFn = async (commentDOM: string) => {
  const { repo, repoId, category, categoryId, mapping, reactionsEnabled, emitMetadata, inputPosition, lang } = SITE_INFO.Comment.Giscus;
  if (!repo || !repoId) {
    document.querySelector(commentDOM)!.innerHTML = '<p style="text-align:center;color:var(--vh-text-secondary);padding:2rem 0;font-size:0.875rem;">请先在 config.ts 中配置 Giscus 的 repo 和 repoId</p>';
    return;
  }
  const container = document.querySelector(commentDOM)!;
  container.innerHTML = '';
  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', repo);
  script.setAttribute('data-repo-id', repoId);
  script.setAttribute('data-category', category);
  script.setAttribute('data-category-id', categoryId);
  script.setAttribute('data-mapping', mapping);
  script.setAttribute('data-reactions-enabled', reactionsEnabled);
  script.setAttribute('data-emit-metadata', emitMetadata);
  script.setAttribute('data-input-position', inputPosition);
  script.setAttribute('data-lang', lang);
  script.setAttribute('data-theme', 'dark');
  script.setAttribute('crossorigin', 'anonymous');
  script.async = true;
  container.appendChild(script);
}

// 检查是否开启评论
const checkComment = () => {
  const CommentARR: any = Object.keys(SITE_INFO.Comment);
  const CommentItem = CommentARR.find((i: keyof typeof SITE_INFO.Comment) => SITE_INFO.Comment[i].enable);
  return CommentItem;
}

// 初始化评论插件
const commentInit = async (key: string, walineInit?: any) => {
  // 评论 DOM
  const commentDOM = '.vh-comment>section'
  if (!document.querySelector(commentDOM)) return;
  // 评论列表
  const CommentList: any = { TwikooFn, WalineFn, GiscusFn };
  // 初始化评论
  CommentList[`${key}Fn`](commentDOM, walineInit);
}

export { checkComment, commentInit }