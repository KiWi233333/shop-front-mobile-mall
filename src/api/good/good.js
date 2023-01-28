import { request } from "@/util/request";

/**
 * @商品分类
 * @returns
 */
// 获取一级分类列表
export function getFirstSortList() {
  return request({
    method: "get",
    url: "/goodsCategory/query/one",
  });
}
// 获取二级分类列表
export function getSecondSortList(id) {
  return request({
    method: "get",
    url: `/goodsCategory/query/child/${id}`,
  });
}
// 获取全部分类列表
export function getAllSortList() {
  return request({
    method: "get",
    url: `/goodsCategory/select`,
  });
}
