import { request } from "@/util/request";
// import qs from "qs";

/**
 * 查询单个订单
 * @param {string} id
 * @param {string} token
 * @returns
 */
export function getOrderById(id, token) {
  return request({ method: "get", url: `/orders/query/${id}`, headers: { Authorization: token } });
}

/**
 * 获取所有的订单
 * @param {*} token
 * @returns
 */
export function getAllOrder(token) {
  return request({ method: "get", url: `/orders/query/all`, headers: { Authorization: token } });
}

/**
 * 获取未付款的订单
 * @param {*} token
 * @returns
 */
export function getUnPaidOrder(token) {
  return request({ method: "get", url: `/orders/query/unpaid`, headers: { Authorization: token } });
}

/**
 * 获取未发货的订单
 * @param {*} token
 * @returns
 */
export function getUnDeliverOrder(token) {
  return request({ method: "get", url: `/orders/query/beShipped`, headers: { Authorization: token } });
}

/**
 * 获取待收货的订单
 * @param {*} token
 * @returns
 */
export function getDeliveredOrder(token) {
  return request({ method: "get", url: `/orders/query/undelivered`, headers: { Authorization: token } });
}
/**
 * 获取已完成的订单
 * @param {*} token
 * @returns
 */
export function getDoneOrder(token) {
  return request({ method: "get", url: `/orders/query/completed`, headers: { Authorization: token } });
}
/**
 * 查询订单属性信息
 * @param {*} id 订单id
 * @param {*} token
 * @returns
 */
export function getOrderProps(id, token) {
  return request({ method: "get", url: `/orderItem/query/${id}`, headers: { Authorization: token } });
}

/**
 * 提交订单
 * @param {number} aid 用户收货id
 * @param {Array} items  订单商品列表
 * [{
      gid: 1579762804599140400,
      quantity: 1,
    }],
 * @param {string} remarks 备注
 * @param {string} token 
 * @returns
 */
export function submitOrder(aid, items, remarks, token) {
  return request({
    method: "post",
    url: `/orders/submit`,
    headers: { Authorization: token },
    data: {
      aid,
      items,
      remarks,
    },
  });
}

/**
 * 支付订单
 * @param {number} id 订单id
 * @param {string} token
 * @returns
 */
export function payOrder(id, token) {
  return request({
    method: "put",
    url: `/orders/payment/${id}`,
    headers: { Authorization: token },
  });
}

/**
 * 修改订单
 * @param {number} id 订单id
 * @param {string} aid 收获id
 * @param {string} remarks 备注
 * @param {string} token
 * @returns
 */
export function updateOrder(id, aid, remarks, token) {
  return request({
    method: "put",
    url: `/orders/update/${id}`,
    headers: { Authorization: token },
    data: { aid, remarks },
  });
}

/**
 * 完成订单
 * @param {number} id 订单id
 * @param {string} token
 * @returns
 */
export function doneOrder(id, token) {
  return request({
    method: "put",
    url: `/orders/complete/${id}`,
    headers: { Authorization: token },
  });
}

/**
 * 删除订单
 * @param {number} id 订单id
 * @param {string} token
 * @returns
 */
export function deleteOrderById(id, token) {
  return request({
    method: "delete",
    url: `/orders/cancel/${id}`,
    headers: { Authorization: token },
  });
}

/**
 * 取消订单
 * @param {number} id 订单id
 * @param {string} token
 * @returns
 */
export function cancelOrderById(id, token) {
  return request({
    method: "delete",
    url: `/orders/cancel/${id}`,
    headers: { Authorization: token },
  });
}
