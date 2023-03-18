/**
 * 异步缓存数组数据 list Array
 * @param {Array} oldList 旧函数
 * @param {function} asyncFn
 * @param {object} asyncParams 异步函数的参数
 * @param {string} uuid
 * @returns caches
 */
export const asyncCacheData = async (oldList, asyncFn, asyncParams = {}, uuid) => {
  // 缓存
  let list = JSON.parse(sessionStorage.getItem(uuid)) || [];
  if (list.length > 0) {
    list.forEach(p => {
      oldList.push(p);
    });
  }
  // 是否为空的异步形参
  const res = JSON.stringify(asyncParams) === "{}" ? await asyncFn() : await asyncFn(...asyncParams);
  if (list.length > 0) {
    if (JSON.stringify(list) !== JSON.stringify(res.data.data)) {
      // 若更新了
      console.log("更新了分类");
      list = res.data.data;
      sessionStorage.setItem(uuid, JSON.stringify(res.data.data));
    }
  } else {
    list = res.data.data;
    sessionStorage.setItem(uuid, JSON.stringify(res.data.data));
  }
  return list;
};
