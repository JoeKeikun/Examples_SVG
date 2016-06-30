/**
 * UED内部研发：计算水滴尾巴的方法类.
 *
 * @namespace sux
 * @class waterdrop
 */
(function(name, definition) {
  var sux = this.sux = this.sux || {};

  sux[name] = definition();
})('waterdrop', function() {
  var waterdrop = function() {};

  /**
   * 通过入参，计算组成水滴形状的两条贝塞尔曲线控制点.
   *
   * @method getBezierPoints
   *
   * @param  {Number} x 起始点x轴坐标
   * @param  {Number} y 起始点x轴坐标
   * @param  {Number} deltaX 起始点x轴上的间距
   * @param  {Number} deltaY 起始点y轴上的间距
   * @param  {Number} fromR 起始点的半径
   * @param  {Number} toR 目标点的半径
   * @return {Object} 返回包含x1, y1, x2, y2, ... x8, y8十六个参数，分别代表关键点
   */
  waterdrop.prototype.getBezierPoints = function(x, y, deltaX, deltaY, fromR, toR) {
    var x0, y0, // 目标点的坐标
      dX1, dY1, dX2, dY2, dX3, dY3, dX4, dY4, dX5, dY5, dX6, dY6, dX7, dY7, dX8, dY8, // 偏移量
      dis, // 起始点和目标点的距离
      deltaGarmar, // 切线和y轴的夹角
      alpha, // 两点连线和x轴的夹角
      cosAlpha, sinAlpha;

    // 计算圆2的圆点坐标
    x0 = x + deltaX;
    y0 = y + deltaY;

    // 计算距离
    dis = Math.sqrt(Math.pow((deltaX), 2) + Math.pow((deltaY), 2));
    if (dis < Math.max(fromR, toR)) {
      return {
        x1: x0,
        y1: y0,
        x2: x0,
        y2: y0,
        x3: x0,
        y3: y0,
        x4: x0,
        y4: y0,
        x5: x0,
        y5: y0,
        x6: x0,
        y6: y0,
        x7: x0,
        y7: y0,
        x8: x0,
        y8: y0
      };
    }

    // 计算两点连线的夹角
    // tan函数的角度取值范围[-π/2, π/2], 故对alpha值做第二、第三象限处理
    if (deltaX >= 0) {
      alpha = -Math.atan(deltaY / deltaX) + Math.PI / 2;
    } else {
      alpha = -Math.atan(deltaY / deltaX) + Math.PI * 3 / 2;
    }
    sinAlpha = Math.sin(alpha);
    cosAlpha = Math.cos(alpha);

    // 计算切线和y轴的夹角
    deltaGarmar = Math.asin((fromR - toR) / dis);

    // 四个点的偏移量
    dX1 = fromR * Math.cos(deltaGarmar);
    dY1 = fromR * Math.sin(deltaGarmar);
    dX2 = fromR / Math.cos(Math.PI / 4 - deltaGarmar / 2) * Math.cos(Math.PI / 4 + deltaGarmar / 2);
    dY2 = fromR;
    dX3 = toR;
    dY3 = fromR;
    dX4 = toR;
    dY4 = Math.abs(deltaY);
    dX5 = -dX1;
    dY5 = dY1;
    dX6 = -dX2;
    dY6 = dY2;
    dX7 = -dX3;
    dY7 = dY3;
    dX8 = -dX4;
    dY8 = dY4;

    return {
      x1: x + dX1 * cosAlpha + dY1 * sinAlpha,
      y1: y + dY1 * cosAlpha - dX1 * sinAlpha,
      x2: x + dX2 * cosAlpha + dY2 * sinAlpha,
      y2: y + dY2 * cosAlpha - dX2 * sinAlpha,
      x3: x + dX3 * cosAlpha + dY3 * sinAlpha,
      y3: y + dY3 * cosAlpha - dX3 * sinAlpha,
      x4: x + dX4 * cosAlpha + dY4 * sinAlpha,
      y4: y + dY4 * cosAlpha - dX4 * sinAlpha,
      x5: x + dX5 * cosAlpha + dY5 * sinAlpha,
      y5: y + dY5 * cosAlpha - dX5 * sinAlpha,
      x6: x + dX6 * cosAlpha + dY6 * sinAlpha,
      y6: y + dY6 * cosAlpha - dX6 * sinAlpha,
      x7: x + dX7 * cosAlpha + dY7 * sinAlpha,
      y7: y + dY7 * cosAlpha - dX7 * sinAlpha,
      x8: x + dX8 * cosAlpha + dY8 * sinAlpha,
      y8: y + dY8 * cosAlpha - dX8 * sinAlpha
    };
  }

  return new waterdrop;
});