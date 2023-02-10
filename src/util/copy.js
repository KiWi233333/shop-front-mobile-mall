export function copyText(text) {
  // 动态创建 textarea 标签
  const textarea = document.createElement("textarea");
  // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
  textarea.readOnly = "readonly";
  textarea.style.position = "absolute";
  textarea.style.opacity = "0";
  textarea.style.left = "-9999px";
  // 将要 copy 的值赋给 textarea 标签的 value 属性
  textarea.value = text;
  // 将 textarea 插入到 body 中
  document.body.appendChild(textarea);
  // 选中值并复制
  textarea.select();
  const result = document.execCommand("Copy");
  document.body.removeChild(textarea);
  return result;
}
/**
 *
 * 复制文本
 * @param text 复制的文本
 * @returns promise
 */
export function copyTextAsync(text) {
  // 新语法
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  } else {
    // 兼容移动端版本
    return new Promise((res, rej) => {
      if (copyText(text)) {
        return res(true);
      } else {
        return rej(false);
      }
    });
  }
}
