import { getCollection } from "astro:content";
const posts = (await getCollection("blog")).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
// 获取文章分类
const getCategories = () => {
  const categoriesList = posts.reduce((acc: any, i: any) => {
    acc[i.data.categories] = (acc[i.data.categories] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(categoriesList).map(([title, count]) => ({ title, count }));
}

// 获取统计数据
const getCountInfo = () => {
  return { ArticleCount: posts.length, CategoryCount: getCategories().length, TagCount: getTags().length }
}

// 获取文章标签
const getTags = () => {
  const tagList = posts.reduce((acc: any, i: any) => {
    (i.data.tags || []).forEach((tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});
  return Object.entries(tagList).sort((a: any, b: any) => b[1] - a[1]);
}

// 获取推荐文章 (给文章添加 recommend: true 字段)
const getRecommendArticles = () => {
  const recommendList = posts.filter(i => i.data.recommend);
  return (recommendList.length ? recommendList : posts.slice(0, 6)).map(i => ({ title: i.data.title, date: i.data.date, id: i.data.id }))
};

// 获取上一篇下一篇文章
const getPrevNextPosts = (id: string) => {
  const noHidePosts = posts.filter(i => !i.data.hide);
  const index = noHidePosts.findIndex(i => i.data.id === id);
  const none = { title: '没有啦~', id: '#' };
  return { prev: noHidePosts[index - 1] ? noHidePosts[index - 1].data : none, next: noHidePosts[index + 1] ? noHidePosts[index + 1].data : none }
}


// 获取相关文章（基于标签和分类匹配）
const getRelatedPosts = (currentId: string, tags: string[] = [], categories: string = '', limit = 4) => {
  const scored = posts
    .filter(i => i.data.id !== currentId && !i.data.hide)
    .map(i => {
      let score = 0;
      const postTags = i.data.tags || [];
      postTags.forEach((t: string) => { if (tags.includes(t)) score += 2; });
      if (i.data.categories === categories) score += 3;
      return { ...i, score };
    })
    .filter(i => i.score > 0)
    .sort((a, b) => b.score - a.score || b.data.date.valueOf() - a.data.date.valueOf())
    .slice(0, limit);
  if (scored.length < limit) {
    const existingIds = new Set(scored.map(i => i.data.id));
    existingIds.add(currentId);
    const fillers = posts
      .filter(i => !existingIds.has(i.data.id) && !i.data.hide)
      .slice(0, limit - scored.length);
    scored.push(...fillers);
  }
  return scored.map(i => ({ title: i.data.title, id: i.data.id, cover: i.data.cover, date: i.data.date, tags: i.data.tags, categories: i.data.categories }));
};

export { getCategories, getTags, getRecommendArticles, getCountInfo, getPrevNextPosts, getRelatedPosts };