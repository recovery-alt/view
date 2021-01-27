module.exports = {
  productionSourceMap: false,
  css: { loaderOptions: { sass: { prependData: '@import "@/assets/style/color.scss";' } } },
};
