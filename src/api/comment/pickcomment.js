import { request } from "@/util/request";

/**
 * 新增对评论的评论
 * @param {number} evaluationId 商品id
 * @param {number} fid 父级
 * @param {string} content
 * @param {token} token
 * @returns
 */
export function addNewComment(evaluationId, fid, content, token) {
  return request({
    method: "poset",
    url: `/comments/save`,
    headers: {
      Authorization: token,
    },
    data: {
      evaluationId,
      fid,
      content,
    },
  });
}

/**
 *  对评论的子评论点赞
 * @param {string} id
 * @param {string} token
 * @returns
 */
export function addCommentlikedByGid(id, token) {
  return request({
    method: "put",
    url: `/evaluation/liked/${id}`,
    headers: {
      Authorization: token,
    },
  });
}
