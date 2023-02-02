import { request } from "@/util/request";

/**
 *  获取商品详细规格
 * @param {string} gid
 * @returns
 */
export function getGoodPropsById(gid) {
  return request({
    method: "get",
    url: `/goodsItem/query/${gid}`,
  });
}
