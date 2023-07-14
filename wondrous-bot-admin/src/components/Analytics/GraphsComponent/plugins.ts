export const paddingBelowLegend = {
  id: "paddingBelowLegends",
  beforeInit: function (chart: any, options) {
    const originalFit = chart.legend.fit;
    chart.legend.fit = function () {
      originalFit.bind(chart.legend)();
      this.height += 24;
      console.log(this, 'THIS')
      this.width += 200;
    };
  },
};


// export const legendMarginRight = {
//   id: "legendMarginRight",
//   afterInit: function (chart: any, options) {
//     console.log('im here')
//     const originalFit = chart.legend.fit;
//     chart.legend.fit = function () {
//       originalFit.bind(chart.legend)();
//       let width = this.width += 200;
//       return width;
//     };
//   }
// }