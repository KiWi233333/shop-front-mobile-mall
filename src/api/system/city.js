import { request } from "@/util/request";

/**
 * 获取所有省
 * @returns
 */
export function getAllCitys() {
  return request({
    method: "get",
    url: "/province/allProvince",
  });
}

/**
 * 获取所有市（cid）
 * @returns
 */
export function getProvincesByCid(id) {
  return request({
    method: "get",
    url: "/province/city",
    params: {
      id,
    },
  });
}
/**
 * 获取所有区（pid）
 * @returns
 */
export function getAreasBypid(city, pid) {
  return request({
    method: "get",
    url: "/api/province/area",
    params: {
      city,
      pid,
    },
  });
}
