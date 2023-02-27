import { request } from "@/util/request";

/**
 * 获取评论子评论
 * @param {String} fid
 * @param {*} token
 * @returns
 */
export function getCommentSons(fid, token) {
  return request({
    method: "get",
    url: `/comments/query`,
    headers: {
      Authorization: token,
    },
    params: {
      id: fid,
    },
  });
}
/**
 * 新增对评论的评论
 * @param {number} evaluationId 评价id
 * @param {number} fid 评论的父级 或则 null
 * @param {string} content 内容
 * @param {token} token
 * @returns
 */
export function addCommentChild(evaluationId, fid, content, token) {
  if (!fid) fid = null; // 清空
  return request({
    method: "post",
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
 * @param {string} fid 评论父id
 * @param {string} token
 * @returns
 */
export function addCommentlikedByfid(fid, token) {
  return request({
    method: "put",
    url: `/comments/liked/${fid}`,
    headers: {
      Authorization: token,
    },
  });
}

/**
 *  删除评论
 * @param {string} id 评论kd
 * @param {string} token
 * @returns
 */
export function deleteCommentByfid(id, token) {
  return request({
    method: "delete",
    url: `/comments/delete/${id}`,
    headers: {
      Authorization: token,
    },
  });
}
