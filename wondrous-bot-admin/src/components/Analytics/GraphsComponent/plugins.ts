export const paddingBelowLegend = {
  id: "paddingBelowLegends",
  beforeInit: function (chart: any, options) {
    const originalFit = chart.legend.fit;
    chart.legend.fit = function () {
      originalFit.bind(chart.legend)();
      this.height += 24;
      this.width += 200;
    };
  },
};
