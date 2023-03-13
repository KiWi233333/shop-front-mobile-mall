import { request } from "@/util/request";

/**
 * 获取用户基本信息
 * @param {String} token
 * @returns
 */
export function getBaseInfo(token) {
  return request({
    method: "get",
    url: "/userInfo/me",
    headers: { Authorization: token },
  });
}

/**
 * 更新用户基本信息
 * @param {Object} info 用户信息
 * @param {String} token
 * @returns
 */
export function updateBaseInfo({ fullName, gender, age, email, birthday, qq }, token) {
  return request({
    method: "put",
    url: "/userInfo/update",
    headers: { Authorization: token },
    data: { fullName, gender, age: +age, email, birthday, qq },
  });
}
