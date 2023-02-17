/* eslint-disable no-useless-escape */
export function checkText(text) {
  text = text
    .replace(/(<br[^>]*>| |\s*)/g, "")
    .replace(/\&/g, "&amp;")
    .replace(/\"/g, "&quot;")
    .replace(/\'/g, "&#39;")
    .replace(/\</g, "&lt;")
    .replace(/\>/g, "&gt;");
  return text;
}
