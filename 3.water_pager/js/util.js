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
		dY3 = (fromR) * deltaY / Math.abs(deltaY),
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

	return {
		x1: x1,
		y1: y1,
		x2: x2,
		y2: y2,
		x3: x3,
		y3: y3,
		x4: x4,
		y4: y4,
		x5: x5,
		y5: y5,
		x6: x6,
		y6: y6,
		x7: x7,
		y7: y7,
		x8: x8,
		y8: y8
	};
}

timingfn = {};
timingfn.linear = function(e) {
	return e
};
timingfn.swing = function(e) {
	return .5 - Math.cos(e * Math.PI) / 2
};
timingfn.easeInQuad = function(p) {
	return Math.pow(p, 2);
};
timingfn.easeOutQuad = function(p) {
	return 1 - timingfn.easeInQuad(1 - p);
};
timingfn.easeInOutQuad = function(p) {
	return p < 0.5 ?
		timingfn.easeInQuad(p * 2) / 2 :
		1 - timingfn.easeInQuad(p * -2 + 2) / 2;
};
timingfn.easeInCubic = function(p) {
	return Math.pow(p, 3);
};
timingfn.easeOutCubic = function(p) {
	return 1 - timingfn.easeInCubic(1 - p);
};
timingfn.easeInOutCubic = function(p) {
	return p < 0.5 ?
		timingfn.easeInCubic(p * 2) / 2 :
		1 - timingfn.easeInCubic(p * -2 + 2) / 2;
};
timingfn.easeInQuart = function(p) {
	return Math.pow(p, 4);
};
timingfn.easeOutQuart = function(p) {
	return 1 - timingfn.easeInQuart(1 - p);
};
timingfn.easeInOutQuart = function(p) {
	return p < 0.5 ?
		timingfn.easeInQuart(p * 2) / 2 :
		1 - timingfn.easeInQuart(p * -2 + 2) / 2;
};
timingfn.easeInQuint = function(p) {
	return Math.pow(p, 5);
};
timingfn.easeOutQuint = function(p) {
	return 1 - timingfn.easeInQuint(1 - p);
};
timingfn.easeInOutQuint = function(p) {
	return p < 0.5 ?
		timingfn.easeInQuint(p * 2) / 2 :
		1 - timingfn.easeInQuint(p * -2 + 2) / 2;
};
timingfn.easeInExpo = function(p) {
	return Math.pow(p, 6);
};
timingfn.easeOutExpo = function(p) {
	return 1 - timingfn.easeInExpo(1 - p);
};
timingfn.easeInOutExpo = function(p) {
	return p < 0.5 ?
		timingfn.easeInExpo(p * 2) / 2 :
		1 - timingfn.easeInExpo(p * -2 + 2) / 2;
};
timingfn.easeInSine = function(p) {
	return 1 - Math.cos(p * Math.PI / 2);
};
timingfn.easeOutSine = function(p) {
	return 1 - timingfn.easeInSine(1 - p);
};
timingfn.easeInOutSine = function(p) {
	return p < 0.5 ?
		timingfn.easeInSine(p * 2) / 2 :
		1 - timingfn.easeInSine(p * -2 + 2) / 2;
};
timingfn.easeInCirc = function(p) {
	return 1 - Math.sqrt(1 - p * p);
};
timingfn.easeOutCirc = function(p) {
	return 1 - timingfn.easeInCirc(1 - p);
};
timingfn.easeInOutCirc = function(p) {
	return p < 0.5 ?
		timingfn.easeInCirc(p * 2) / 2 :
		1 - timingfn.easeInCirc(p * -2 + 2) / 2;
};
timingfn.easeInElastic = function(p) {
	return p === 0 || p === 1 ? p :
		-Math.pow(2, 8 * (p - 1)) * Math.sin(((p - 1) * 80 - 7.5) * Math.PI / 15);
};
timingfn.easeOutElastic = function(p) {
	return 1 - timingfn.easeInElastic(1 - p);
};
timingfn.easeInOutElastic = function(p) {
	return p < 0.5 ?
		timingfn.easeInElastic(p * 2) / 2 :
		1 - timingfn.easeInElastic(p * -2 + 2) / 2;
};
timingfn.easeInBack = function(p) {
	return p * p * (3 * p - 2);
};
timingfn.easeOutBack = function(p) {
	return 1 - timingfn.easeInBack(1 - p);
};
timingfn.easeInOutBack = function(p) {
	return p < 0.5 ?
		timingfn.easeInBack(p * 2) / 2 :
		1 - timingfn.easeInBack(p * -2 + 2) / 2;
};
timingfn.easeInBounce = function(p) {
	var pow2,
		bounce = 4;

	while (p < ((pow2 = Math.pow(2, --bounce)) - 1) / 11) {};
	return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - p, 2);
};
timingfn.easeOutBounce = function(p) {
	return 1 - timingfn.easeInBounce(1 - p);
};
timingfn.easeInOutBounce = function(p) {
	return p < 0.5 ?
		timingfn.easeInBounce(p * 2) / 2 :
		1 - timingfn.easeInBounce(p * -2 + 2) / 2;
};


/* 动画处理函数 */
(function() {
	var ID = null,
		STARTTIME = null,
		DURATION = null,
		CALLBACK = null;

	var step = function(timestamp) {
		if (!STARTTIME) {
			STARTTIME = timestamp;
		}

		var gap = timestamp - STARTTIME,
			precent = gap / DURATION;

		if (CALLBACK) {
			CALLBACK(precent);
		}

		if (gap < DURATION) {
			ID = requestAnimationFrame(step);
		} else {
			ID = null,
			STARTTIME = null,
			DURATION = null,
			CALLBACK = null;
		}
	}

	doAnimate = function(fn, duration) {
		if (ID) {
			stopAnimate();
		}

		CALLBACK = fn;
		DURATION = duration;

		requestAnimationFrame(step);
	}

	stopAnimate = function() {
		if (ID) {
			cancelAnimationFrame(ID);
		}

		ID = null,
		STARTTIME = null,
		DURATION = null,
		CALLBACK = null;
	}
})()