module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  // 插件--按需引入vant组件
  plugins: [
    [
      "import",
      {
        libraryName: "vant",
        libraryDirectory: "es",
        // 按需引入less
        style: (name) => `${name}/style/less`,
      },
      "vant",
    ],
  ],
};
