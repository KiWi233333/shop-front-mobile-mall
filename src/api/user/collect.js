import { request } from "@/util/request";

/**
 * 查询用户全部收藏
 * @param {*} token
 * @returns
 */
export function getAllCollectByGid(token) {
  return request({
    method: "get",
    url: `/collection/query`,
    headers: {
      Authorization: token,
    },
  });
}

/**
 * 查询本商品是否收藏
 * @param {*} gid
 * @param {*} token
 * @returns
 */
export function getTheCollectByGid(gid, token) {
  return request({
    method: "get",
    url: `/collection/query/${gid}`,
    headers: {
      Authorization: token,
    },
  });
}

/**
 * 添加用户收藏
 * @param {string} gid
 * @param {string} token
 * @returns
 */
export function addCollectByGid(gid, token) {
  return request({
    method: "post",
    url: `/collection/save/${gid}`,
    headers: {
      Authorization: token,
    },
  });
}

/**
 * 删除取消收藏
 * @param {string} gid
 * @param {string} token
 * @returns
 */
export function deleteCollectByGid(gid, token) {
  return request({
    method: "delete",
    url: `/collection/delete/${gid}`,
    headers: {
      Authorization: token,
    },
  });
}
