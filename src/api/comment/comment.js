import { request } from "@/util/request";

/**
 *  获取商品的评论
 * @param {obj} p {token,goodsId,sort}
 * @returns
 */
export function getGoodCommentById(p) {
  return request({
    method: "get",
    url: `/evaluation/query`,
    headers: {
      Authorization: p.token,
    },
    params: {
      goodsId: p.goodsId,
      sort: p?.sort || 0, // 排序方式（0：默认排序，1：最新排序）
    },
  });
}

/**
 *  对评论点赞
 * @param {string} id
 * @param {string} token
 * @returns
 */
export function getCommentlikedByGid(id, token) {
  return request({
    method: "put",
    url: `/evaluation/liked/${id}`,
    headers: {
      Authorization: token,
    },
  });
}
