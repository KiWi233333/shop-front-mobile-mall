import { baseURL, request } from "@/util/request";
// 获取图片资源路径
export function getResourImageByName(url) {
  return baseURL + "/resources/image?name=" + url;
}

// 获取首页最新活动轮播事件
export function getEventActives() {
  return request({
    method: "get",
    url: "/events/query",
  });
}

/**
 * 获取活动的商品
 * @param {*} page
 * @param {*} size
 * @param {*} id
 * @returns
 */
export function getEventGoodsById(page, size, id) {
  return request({
    method: "get",
    url: `/eventsGoods/query/${page}/${size}/${id}`,
  });
}
