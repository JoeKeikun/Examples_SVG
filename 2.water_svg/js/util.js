function distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

function distanceByDeltaValue(deltaX, deltaY) {
	return Math.sqrt(Math.pow((deltaX), 2) + Math.pow((deltaY), 2));
}

// 获取贝塞尔曲线路径
function bezierPath(x, y, deltaX, deltaY, fromR, toR) {
	var x0, y0,
		x1, y1,
		x2, y2,
		x3, y3,
		x4, y4,
		ang1, ang2, ang3, ang4;

	var dis = distance(x, y, x + deltaX, y + deltaY);

	if (dis < (fromR - toR)) {
		return '';
	}

	// 计算两条相交直线的夹脚
	var deltaGarmar = Math.asin((fromR - toR) / dis),
		deltaAlpha = Math.PI / 2 - deltaGarmar,
		deltaTheta = deltaAlpha / 3;

	// 计算4个点的夹脚
	if (deltaY < 0) {
		ang1 = -deltaGarmar;
	} else {
		ang1 = deltaGarmar;
	}

	var dX1 = fromR * Math.cos(ang1),
		dY1 = fromR * Math.sin(ang1),
		dX2 = fromR / Math.cos(Math.PI / 4 - deltaGarmar / 2) * Math.cos(Math.PI / 4 + deltaGarmar / 2),
		dY2 = fromR * deltaY / Math.abs(deltaY),
		dX3 = toR,
		dY3 = fromR * deltaY / Math.abs(deltaY),
		dX4 = toR,
		dY4 = 0;

	// 计算圆2的圆点坐标
	x0 = x + deltaX;
	y0 = y + deltaY;
	// 计算圆1的第一个切点
	x1 = x + dX1;
	y1 = y + dY1;
	// 计算圆1的第二个切点
	x2 = x + dX2;
	y2 = y + dY2;
	// 计算圆2的第一个切点
	x3 = x + dX3;
	y3 = y + dY3;
	// 计算圆2的第二个切点
	x4 = x0 + dX4;
	y4 = y0 + dY4;

	var xx4 = x0 + toR * Math.cos(deltaGarmar),
		yy4 = y0 + toR * Math.sin(deltaGarmar);

	// 计算圆1的第一个切点
	x5 = x - dX1;
	y5 = y + dY1;
	// 计算圆1的第二个切点
	x6 = x - dX2;
	y6 = y + dY2;
	// 计算圆2的第一个切点
	x7 = x - dX3;
	y7 = y + dY3;
	// 计算圆2的第二个切点
	x8 = x0 - dX4;
	y8 = y0 + dY4;

	var svgStr = 'M' + x1 + ',' + y1;
	svgStr += 'C' + x2 + ',' + y2 + ' ' + x3 + ',' + y3 + ' ' + x4 + ',' + y4;
	svgStr += ' L' + x8 + ',' + y8;
	svgStr += 'C' + x7 + ',' + y7 + ' ' + x6 + ',' + y6 + ' ' + x5 + ',' + y5;


	// // 绘制参照点1
	svg.circle(x1, y1, 1).attr({
		fill: 'red'
	});
	// 绘制参照点2
	svg.circle(x2, y2, 1).attr({
		fill: 'green'
	});
	// 绘制参照点1
	svg.circle(x3, y3, 1).attr({
		fill: 'blue'
	});
	// 绘制参照点2
	svg.circle(x4, y4, 1).attr({
		fill: 'yellow'
	});
	// 绘制参照点2
	svg.circle(xx4, yy4, 1).attr({
		fill: 'gray'
	});

	return svgStr;
}

function draw(x, y, deltaX, deltaY, fromR, toR) {
	var x0, y0,
		x1, y1,
		x2, y2,
		x3, y3,
		x4, y4,
		ang1, ang2, ang3, ang4;

	var dis = distance(x, y, x + deltaX, y + deltaY),
		dis2 = distance(x, y, x + toR, y + deltaY);

	// 计算两条相交直线的夹脚
	var deltaGarmar = Math.atan(toR / dis),
		deltaAlpha = Math.asin(fromR / dis2),
		deltaTheta = Math.PI / 2 - deltaGarmar - deltaAlpha;

	console.log(dis, dis2);

	x0 = x + deltaX;
	y0 = y + deltaY;

	x1 = x + fromR * Math.cos(deltaTheta);
	y1 = y + fromR * Math.sin(deltaTheta);

	x2 = 0;
	y2 = 0;

	x3 = 0;
	y3 = 0;

	x4 = 0;
	y4 = 0;

	// 绘制参照点1
	svg.circle(x0, y0, 1).attr({
		fill: 'red'
	});

	// 绘制参照点1
	svg.circle(x1, y1, 1).attr({
		fill: 'red'
	});
	// 绘制参照点2
	svg.circle(x2, y2, 1).attr({
		fill: 'green'
	});
	// 绘制参照点1
	svg.circle(x3, y3, 1).attr({
		fill: 'blue'
	});
	// 绘制参照点2
	svg.circle(x4, y4, 1).attr({
		fill: 'yellow'
	});
}