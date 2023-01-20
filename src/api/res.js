import { baseURL } from "@/util/request";
// 获取图片资源路径
export function getResourImageByName(url) {
  return baseURL + "/resources/image?name=" + url;
}
