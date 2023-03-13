import { request } from "@/util/request";
import qs from "qs";
/**
 * 获取默认地址
 * @param {string} token
 * @returns
 */
export function getDefaultAddress(token) {
  return request({
    method: "get",
    url: "/address/default",
    headers: {
      Authorization: token,
    },
  });
}

/**
 * 获取所有的地址
 * @param {string} token
 * @returns
 */
export function getAllAddress(token) {
  return request({
    method: "get",
    url: "/address/all",
    headers: {
      Authorization: token,
    },
  });
}

/**
 * 通过id获取地址
 * @param {string} token
 * @returns
 */
export function getAddressById(id, token) {
  return request({
    method: "get",
    url: `/address/query/${id}`,
    headers: {
      Authorization: token,
    },
  });
}

/**
 * 添加地址
 * @param {string} token
 * @param {object} addressInfo 地址信息
    "name": "string",
    "phone": "string",
    "province": "string",省份
    "city": "string",
    "district": "string",区/县
    "address": "string",详细收货地址
    "isDefault": 0 是否默认收货地址
 * @returns
 */
export function putAddres(addressInfo, token) {
  const { name, phone, province, city, district, address, isDefault } = addressInfo;
  return request({
    method: "post",
    url: `/address/save`,
    headers: { Authorization: token },
    data: { name, phone, province, city, district, address, isDefault: +isDefault },
  });
}

/**
 * 修改用户地址
 * @param {string} token 
 * @param {object} updateInfo 
 *    id: 0,收货地址id
      uid: 0,用户id
      name: "string",
      phone: "string",
      province: "string",
      city: "string",
      district: "string",
      address: "string",
      isDefault: 0,
 * @returns 
 */
export function updateAddress(updateInfo, token) {
  const { id, uid, name, phone, province, city, district, address, isDefault } = updateInfo;
  return request({
    method: "put",
    url: "/address/update",
    headers: { Authorization: token },
    data: { id, uid, name, phone, province, city, district, address, isDefault: +isDefault },
  });
}

/**
 * 删除地址
 * @param {*} id 地址Id
 * @param {*} token
 * @returns
 */
export function deleteAddressById(id, token) {
  return request({
    method: "delete",
    url: `/address/delete/${id}`,
    headers: { Authorization: token },
  });
}

/**
 * 批量删除地址
 * @param {Array} ids 地址Id集合
 * @param {String} token
 * @returns
 */
export function deleteAddressByIdsArray(ids, token) {
  return request({
    method: "delete",
    url: "/address/deletes",
    headers: { Authorization: token },

    params: { ids },
    paramsSerializer: {
      serialize(params) {
        return qs.stringify(params, { indices: false });
      },
    },
  });
}
