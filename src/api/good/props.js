import { request } from "@/util/request";

/**
 *  获取商品粗略规格
 * @param {string} gid
 * @returns
 */
export function getGoodPropsById(gid) {
  return request({
    method: "get",
    url: `/goodsItem/query/${gid}`,
  });
}
/**
 * 获取商品详细规格
 * @param {*} gid
 * @param {*} color
 * @param {*} combo
 * @param {*} size
 * @param {*} edition
 * @returns
 */
export function getGoodProps(gid, color, combo, size, edition) {
  return request({
    method: "post",
    url: `/goodsItem/query`,
    data: { gid, color, combo, size, edition },
  });
}
