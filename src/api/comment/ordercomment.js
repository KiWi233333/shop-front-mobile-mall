import { request } from "@/util/request";

/**
 * 根据id查询订单评价
 * @param {String} id
 * @returns
 */
export function getOrderCommentById(id) {
  return request({
    method: "get",
    url: `/comments/query/${id}`,
  });
}

/**
 *  上传订单评价图片
 * @param {String} orderItemId
 * @param {File} fromData
 * @param {String} token
 * @returns
 */
export function uploadOrderImgById(orderItemId, fromData, token) {
  return request({
    method: "post",
    url: `/evaluation/uploadImages/${orderItemId}`,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
    data: fromData,
    timeout: 30000,
  });
}

/**
 * 新增订单评价
 * @param {*} orderItemId
 * @param {*} stars
 * @param {*} images 每张图片用“，”分隔
 * @param {*} content
 * @returns
 */
export function addOrderComment(orderItemId, stars, images, content, token) {
  return request({
    method: "post",
    url: "/evaluation/save",
    headers: { Authorization: token },
    data: {
      orderItemId,
      stars,
      images,
      content,
    },
  });
}

/**
 * 删除评论
 * @param {String} id
 * @param {String} token
 * @returns
 */
export function delteOrderComment(id, token) {
  return request({
    method: "delete",
    url: `/evaluation/delete/${id}`,
    headers: { Authorization: token },
  });
}
