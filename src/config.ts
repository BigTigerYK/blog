export default {
  // 网站标题
  Title: 'Chow的技术博客',
  // 网站地址
  Site: 'https://yaozhenyuanblog.cn',
  // 网站副标题
  Subtitle: '记录学习，分享技术.',
  // 网站描述
  Description: 'Chow的技术博客，专注于技术学习与分享。',
  // 网站作者
  Author: 'Chow',
  // 作者头像
  Avatar: '/assets/images/avatar.jpg',
  // 网站座右铭
  Motto: '',
  // Cover 网站缩略图
  Cover: '/assets/images/banner/072c12ec85d2d3b5.webp',
  // 网站侧边栏公告 (不填写即不开启)
  Tips: '',
  // 首页打字机文案列表
  TypeWriteList: [
    '记录学习，分享技术.',
    'Chow的技术博客',
  ],
  // 网站创建时间
  CreateTime: '2026-05-30',
  // 顶部 Banner 配置
  HomeBanner: {
    enable: true,
    HomeHeight: '38.88rem',
    PageHeight: '28.88rem',
    background: "url('/assets/images/home-banner.webp') no-repeat center 60%/cover",
  },
  // 博客主题配置
  Theme: {
    "--vh-main-color": "#01C4B6",
    "--vh-font-color": "#34495e",
    "--vh-aside-width": "318px",
    "--vh-main-radius": "0.88rem",
    "--vh-main-max-width": "1458px",
  },
  // 导航栏
  Navs: [
    { text: '昔日', link: '/archives', icon: 'Nav_archives' },
    { text: '留言', link: '/message', icon: 'Nav_message' },
    { text: '关于', link: '/about', icon: 'Nav_about' },
  ],
  // 侧边栏个人网站
  WebSites: [
    { text: 'Github', link: 'https://github.com/', icon: 'WebSite_github' },
  ],
  // 侧边栏展示
  AsideShow: {
    WebSitesShow: true,
    CategoriesShow: true,
    TagsShow: true,
    recommendArticleShow: true
  },
  // Google 广告（不填不开启）
  GoogleAds: {
    ad_Client: '',
    asideAD_Slot: '',
    articleAD_Slot: ''
  },
  // 文章内赞赏码（不填不开启）
  Reward: {
    AliPay: '',
    WeChat: ''
  },
  // 评论组件（只允许同时开启一个）
  Comment: {
    Twikoo: {
      enable: false,
      envId: ''
    },
    Waline: {
      enable: false,
      serverURL: ''
    }
  },
  // 访问网页 自动推送到搜索引擎
  SeoPush: {
    enable: false,
    serverApi: '',
    paramsName: 'url'
  },
  // DNS预解析地址
  DNSOptimization: [
    'https://cn.cravatar.com',
  ],
  // 页面阻尼滚动速度
  ScrollSpeed: 666
}
