import { request } from "@/util/request";

/**
 * 根据购物车id获取购物车
 * @param {*} token
 * @returns
 */
export function getAllShopCart(token) {
  return request({
    method: "get",
    url: `/shoppingCart/query`,
    headers: {
      Authorization: token,
    },
  });
}
/**
 * 根据购物车id获取购物车
 * @param {*} id
 * @param {*} token
 * @returns
 */
export function getShopCartById(id, token) {
  return request({
    method: "get",
    url: `/shoppingCart/query/${id}`,
    headers: {
      Authorization: token,
    },
  });
}

/**
 * 增加购物车
 * @param {number} gid
 * @param {number} quantity
 * @param {string} token
 * @returns
 */
export function addShopCart(gid, quantity, token) {
  return request({
    method: "post",
    url: "/shoppingCart/save",
    headers: {
      Authorization: token,
    },
    data: {
      gid,
      quantity,
    },
  });
}

/**
 * 修改购物车（数量、属性）
 * @param {number} id 购物车id
 * @param {number} goodsItemId 商品属性id
 * @param {number} quantity
 * @param {string} token
 * @returns
 */
export function addShopCartProps(id, goodsItemId, quantity, token) {
  return request({
    method: "put",
    url: "/shoppingCart/update",
    headers: {
      Authorization: token,
    },
    data: { id, goodsItemId, quantity },
  });
}

/**
 * 删除单一购物车
 * @param {number} id 购物车id
 * @param {string} token
 * @returns
 */
export function deleteOneShopCart(id, token) {
  return request({
    method: "delete",
    url: `/shoppingCart/delete/${id}`,
    headers: {
      Authorization: token,
    },
  });
}

/**
 * 批量删除购物车
 * @param {array} ids array
 * @param {number} quantity
 * @param {string} token
 * @returns
 */
export function deleteShopcartByBatch(ids, token) {
  return request({
    method: "delete",
    url: `/shoppingCart/deletes`,
    headers: {
      Authorization: token,
    },
    data: {
      ids,
    },
  });
}

/**
 * 清空购物车
 * @param {string} token
 * @returns
 */
export function clearAllShopCart(token) {
  return request({
    method: "delete",
    url: "/shoppingCart/empty",
    headers: {
      Authorization: token,
    },
  });
}
