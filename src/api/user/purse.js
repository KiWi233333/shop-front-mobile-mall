import { request } from "@/util/request";

/**
 * 获取钱包信息
 * @param {string} token
 * @returns
 */
export function getPurseInfo(token) {
  return request({
    method: "get",
    url: "/account/query",
    headers: {
      Authorization: token,
    },
  });
}
/**
 *  用户钱包充值
 * @param {*} token
 * @param {Number} rechargeComboId 充值套餐
 * @param {Number} recharge 充值金额
 * @returns
 */
export function reCharge(token, rechargeComboId, recharge) {
  return request({
    method: "put",
    url: "/account/recharge",
    headers: {
      Authorization: token,
    },
    data: {
      rechargeComboId,
      recharge,
    },
  });
}
/**
 * 查询用户账单
 * @param {string} token
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns
 */
export function getBills(token, year, month, day) {
  return request({
    method: "put",
    url: "/account/bill",
    headers: {
      Authorization: token,
    },
    data: {
      year,
      month,
      day,
    },
  });
}

/**
 * 查询用户账单
 * @param {string} token
 * @returns
 */
export function getRechargeCombo(token) {
  return request({
    method: "get",
    url: "/rechargeCombo/query",
    headers: { Authorization: token },
  });
}
