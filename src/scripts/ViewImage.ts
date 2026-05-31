
import { LoadScript } from "@/utils/index";
// 图片灯箱
declare const ViewImage: any;
const ViewImgList: string[] = [
  // 文章内图片
  "article.vh-article-main img.vh-article-img",
  // 动态页面图片
  "main.talking-main>article>.main img"
];
// 初始化
export default async () => {
  try {
    ViewImage.init(ViewImgList.join(","));
  } catch (error) {
    await LoadScript("/assets/js/view-image.min.js");
    ViewImage.init(ViewImgList.join(","));
  }
}
