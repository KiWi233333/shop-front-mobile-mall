import { request } from "@/util/request";

/**
 * 获取钱包信息
 * @param {string} token
 * @returns
 */
export function getPurseInfo(token) {
  return request({
    method: "get",
    url: "/waller",
    headers: {
      Authorization: token,
    },
  });
}

/**
 *  用户钱包自定义金额充值
 * @param {Number} chargeType 充值类型
 * @param {Number} recharge 充值金额
 * @param {String} token
 * @returns
 */
export function reChargeByBombo(chargeType, rechargeComboId, token) {
  return request({
    method: "post",
    url: "/waller/recharge",
    headers: {
      Authorization: token,
    },
    data: {
      chargeType,
      rechargeComboId,
    },
  });
}

/**
 *  用户钱包自定义金额充值
 * @param {Number} chargeType 充值类型
 * @param {Number} recharge 充值金额
 * @param {String} token
 * @returns
 */
export function reChargeByValue(chargeType, rechargeAmount, token) {
  return request({
    method: "post",
    url: "/waller/recharge",
    headers: {
      Authorization: token,
    },
    data: {
      chargeType,
      rechargeAmount,
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
 * 查询充值列表
 * @param {string} token
 * @returns
 */
export function getRechargeCombo(token) {
  return request({
    method: "get",
    url: "/rechargeCombo/all",
    headers: { Authorization: token },
  });
}
