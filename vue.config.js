const { defineConfig } = require("@vue/cli-service");
const path = require("path");
const themePath = path.resolve(__dirname, "./src/style/theme.less");
module.exports = defineConfig({
  // publicPath: "./",
  transpileDependencies: true,
  // 定制主题
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          modifyVars: {
            // 通过 less 文件覆盖（文件路径为绝对路径）
            hack: `true; @import "${themePath}";`,
          },
        },
      },
    },
  },
});
