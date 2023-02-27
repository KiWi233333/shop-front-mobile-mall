import Vue from "vue";

// 长按事件
Vue.directive("longpress", function (el, binding) {
  let timer = null;
  let start = e => {
    e.preventDefault();
    if (e.type === "click") return; // 点击停止
    if (timer === null) {
      timer = setTimeout(() => {
        binding.value(e);
      }, 600);
    }
  };
  let cancel = e => {
    e.preventDefault();
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  // 开始
  el.addEventListener("mousedown", start);
  el.addEventListener("touchstart", start);
  // 取消
  el.addEventListener("mouseout", cancel);
  el.addEventListener("touchend", cancel);
  el.addEventListener("click", cancel);
});
