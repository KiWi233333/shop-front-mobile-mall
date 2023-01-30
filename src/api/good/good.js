import { request } from "@/util/request";

/**
 * 获取商品列表
 * @param {number} page
 * @param {number} size
 * @param {"name": "string","cid": "string","recommend": 0,"isNew": 0,"saleSort": "string","priceSort": "string"} data
 * @returns
 *  name: "string",
    cid: "string",
    recommend: 0, // 0, 1是0否推荐
    isNew: 0, // 1是0否新品
    saleSort: "Asc", // Asc/Des,销量排序
    priceSort: "Asc", // Asc/Des,价格排序
 */
export function getGoodsListByPageSize(page, size, data) {
  return request({
    method: "post",
    url: `/goods/query/${page}/${size}`,
    data,
  });
}

/**
 * 根据id查询商品详细信息
 * @param {*} id
 * @returns
 */
export function getGoodDetailById(id) {
  return request({
    method: "get",
    url: `/goods/query/${id}`,
  });
}

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
