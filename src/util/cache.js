/**
 * 异步缓存数组数据 list Array
 * @param {function} asyncFn
 * @param {array} asyncDate
 * @param {string} uuid
 * @returns caches
 */
export async function asyncCacheData(asyncFn, asyncDate = {}, uuid) {
  // 缓存
  let caches = [];
  const list = JSON.parse(sessionStorage.getItem(uuid)) || [];
  caches = list.length > 0 ? list : [];
  // 获取icons检测是否更新
  const res = JSON.stringify(asyncDate) === "{}" ? await asyncFn() : await asyncFn(...asyncDate);
  if (list.length > 0) {
    if (JSON.stringify(list) !== JSON.stringify(res.data.data)) {
      // 若更新了
      console.log("更新了分类");
      caches = res.data.data;
      sessionStorage.setItem(uuid, JSON.stringify(res.data.data));
    }
  } else {
    caches = res.data.data;
    sessionStorage.setItem(uuid, JSON.stringify(res.data.data));
  }
  return caches;
}
