import currency from "currency.js";

/**
 * 价格计算
 */
export function price(val) {
  return currency(val);
}
/**
 * 隐藏手机哈
 */
export function hidePhone(val) {
  return val.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");
}

/**
 * 获取时间 MM-dd
 */
export function timeTomds(val) {
  const date = new Date(val);
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}`;
}
