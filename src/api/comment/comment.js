import { request } from "@/util/request";

/**
 *  获取商品的评论
 * @param {string} id
 * @param {string} token
 * @returns
 */
export function getGoodCommentById(token, goodsId, sort) {
  return request({
    method: "get",
    url: `/evaluation/query`,
    headers: {
      Authorization: token,
    },
    params: {
      goodsId,
      sort: sort || 0, // 排序方式（0：默认排序，1：最新排序）
    },
  });
}

/**
 *  对评论点赞
 * @param {string} id
 * @param {string} token
 * @returns
 */
export function addCommentLiked(id, token) {
  return request({
    method: "put",
    url: `/evaluation/liked/${id}`,
    headers: {
      Authorization: token,
    },
  });
}
