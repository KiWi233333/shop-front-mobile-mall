import { request } from "@/util/request";

// 分页获取公告
export function getNoticeByPage(page, size) {
  return request({
    method: "post",
    url: `/notices/query/${page}/${size}`,
  });
}
