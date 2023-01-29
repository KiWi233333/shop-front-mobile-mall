import { request } from "@/util/request";

/**
 * 用户签到
 * @param {string} token
 * @returns
 */
export function toUserSignIn(token) {
  return request({
    method: "post",
    url: "/users/signIn",
    headers: {
      Authorization: token,
    },
  });
}

/**
 * 查询本日是否签到
 * @param {string} token
 * @returns boolean
 */
export function isTodaySignIn(token) {
  return request({
    method: "get",
    url: "/users/signIn/today",
    headers: {
      Authorization: token,
    },
  });
}

/**
 * 查询签到总天数
 * @param {string} token
 * @returns
 */
export function getSignDays(token) {
  return request({
    method: "get",
    url: "/users/signIn/count",
    headers: {
      Authorization: token,
    },
  });
}
