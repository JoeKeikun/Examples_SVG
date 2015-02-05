(function(scope) {
	"use strict";

	// 辅助函数
	var _fibonacci = function(num) {
			if (num < 1) {
				return 0;
			}
			if (num === 2 || num === 1) {
				return 1;
			} else {
				return _fibonacci(num - 1) + _fibonacci(num - 2);
			}
		},
		_getspiralPath = function(boardArr, spiralArr) {
			var boardPath = '',
				i = 0;

			for (; i < boardArr.length - 2 && boardArr.length > 2; i++) {
				boardPath += 'M' + boardArr[i].x + ' ' + boardArr[i].y + ' ';
				boardPath += 'L ' + boardArr[i + 1].x + ' ' + boardArr[i + 1].y + ' ';
				boardPath += 'L ' + boardArr[i + 2].x + ' ' + boardArr[i + 2].y + ' ';
				boardPath += 'L' + spiralArr[i].x + ' ' + spiralArr[i].y + ' ';
				boardPath += 'Z ';
			}
			i--;

			return {
				path: boardPath,
				length: _calLbye4Points(boardArr[i], boardArr[i + 1], boardArr[i + 2], spiralArr[i])
			};
		},
		_getSpiralPath = function(boardArr, spiralArr, clockwiseFlg) {
			var spiralPath = '',
				rSum = 0,
				i = 0;

			for (; i < spiralArr.length - 1; i++) {
				if (i === 0) {
					spiralPath += 'M' + spiralArr[i].x + ' ' + spiralArr[i].y + ' ';
				}

				spiralPath += 'A ' + spiralArr[i].r + ' ' + spiralArr[i].r + ' 0 0 ' + (clockwiseFlg ? '1 ' : '0 ') + spiralArr[i + 1].x + ' ' + spiralArr[i + 1].y +
					' '

				if (i === spiralArr.length - 1) {
					spiralPath += 'Z ';
				}

				// 计算画圆的半径总和
				rSum += spiralArr[i].r;
			}

			return {
				path: spiralPath,
				length: Math.ceil(Math.PI / 2 * rSum)
			};
		},
		_calLbye4Points = function(p1, p2, p3, p4) {
			return Math.abs(p1.x - p2.x) + Math.abs(p2.x - p3.x) + Math.abs(p3.x - p4.x) + Math.abs(p4.x - p1.x) +
				Math.abs(p1.y - p2.y) + Math.abs(p2.y - p3.y) + Math.abs(p3.y - p4.y) + Math.abs(p4.y - p1.y)
		};

	// 方向参数
	var DIRECTION_ARRAY = [
			[0, -1],
			[1, 0],
			[0, 1],
			[-1, 0]
		],
		DIRECTION_ARRAY_REVERSE = [
			[0, -1],
			[-1, 0],
			[0, 1],
			[1, 0]
		];


	var Fibonacci = function(startPoint, unitLength, genPointNum, clockwiseFlag, firstDirection) {
		var pointArr = [], // 直线螺旋点数组
			spiralArr = [], // 弧线螺旋点数组
			tmpUnit = 0,
			i,
			pre,
			dir;

		// 起始点容错
		startPoint = startPoint || {
			x: 0,
			y: 0
		};
		startPoint.x = startPoint.x || 0;
		startPoint.y = startPoint.y || 0;
		// 单位长度容错
		unitLength = unitLength || 1;
		// 生成点数容错
		genPointNum = genPointNum || 1;
		// 顺时针标志位容错
		clockwiseFlag = !!clockwiseFlag;

		switch (firstDirection) {
			case Fibonacci.DIRECTION_RIGHT:
				if (clockwiseFlag) {
					dir = DIRECTION_ARRAY.slice(1).concat(DIRECTION_ARRAY.slice(0, 1));
				} else {
					dir = DIRECTION_ARRAY_REVERSE.slice(3).concat(DIRECTION_ARRAY_REVERSE.slice(0, 3));;
				}
				break;
			case Fibonacci.DIRECTION_DOWN:
				if (clockwiseFlag) {
					dir = DIRECTION_ARRAY.slice(2).concat(DIRECTION_ARRAY.slice(0, 2));
				} else {
					dir = DIRECTION_ARRAY_REVERSE.slice(2).concat(DIRECTION_ARRAY_REVERSE.slice(0, 2));;
				}
				break;
			case Fibonacci.DIRECTION_LEFT:
				if (clockwiseFlag) {
					dir = DIRECTION_ARRAY.slice(3).concat(DIRECTION_ARRAY.slice(0, 3));
				} else {
					dir = DIRECTION_ARRAY_REVERSE.slice(1).concat(DIRECTION_ARRAY_REVERSE.slice(0, 1));;
				}
				break;
			default:
				if (clockwiseFlag) {
					dir = DIRECTION_ARRAY;
				} else {
					dir = DIRECTION_ARRAY_REVERSE;
				}
				break;
		}

		pointArr.push(startPoint);
		for (i = 1; i < genPointNum; i++) {
			tmpUnit = unitLength * _fibonacci(i + 1);
			pre = i - 1;

			pointArr.push({
				x: pointArr[pre].x + dir[pre % 4][0] * tmpUnit,
				y: pointArr[pre].y + dir[pre % 4][1] * tmpUnit
			});

			if (pointArr.length > 2) {
				if (pointArr[pre].x === pointArr[i].x) {
					spiralArr.push({
						x: pointArr[i - 2].x,
						y: pointArr[i].y,
						r: tmpUnit
					});
				} else {
					spiralArr.push({
						x: pointArr[i].x,
						y: pointArr[i - 2].y,
						r: tmpUnit
					});
				}
			}
		}

		return {
			board: _getspiralPath(pointArr, spiralArr),
			spiral: _getSpiralPath(pointArr, spiralArr, clockwiseFlag)
		}
	};

	Fibonacci.DIRECTION_UP = 0;
	Fibonacci.DIRECTION_RIGHT = 1;
	Fibonacci.DIRECTION_DOWN = 2;
	Fibonacci.DIRECTION_LEFT = 3;

	scope.Fibonacci = Fibonacci;
})(window);