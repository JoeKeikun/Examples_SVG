var R = $('#R'),
	r = $('#r'),
	cx = $('#cx'),
	cy = $('#cy'),
	xGap = $('#xGap'),
	yGap = $('#yGap');

var svg = Snap('#main');

function redraw() {
	svg.clear();

	var RV = parseInt(R.val()),
		rV = parseInt(r.val()),
		cxV = parseInt(cx.val()),
		cyV = parseInt(cy.val()),
		xGapV = parseInt(xGap.val()),
		yGapV = parseInt(yGap.val());

	// 圆main
	var c2 = svg.circle(cxV + xGapV, cyV + yGapV, rV);
	c2.attr({
		fill: 'rgba(0,0,0,0.2)'
	});

	// 圆nxt
	var c1 = svg.circle(cxV, cyV, RV);
	c1.attr({
		fill: 'rgba(0,0,0,0.2)'
	});

	// 圆nxt与圆main的衔接
	var res = sux.waterdrop.getBezierPoints(cxV, cyV, xGapV, yGapV, RV, rV);

	var svgStr = 'M' + res.x1 + ',' + res.y1;
	svgStr += 'C' + res.x2 + ',' + res.y2 + ' ' + res.x3 + ',' + res.y3 + ' ' + res.x4 + ',' + res.y4;
	svgStr += ' L' + res.x8 + ',' + res.y8;
	svgStr += 'C' + res.x7 + ',' + res.y7 + ' ' + res.x6 + ',' + res.y6 + ' ' + res.x5 + ',' + res.y5;

	var c3 = svg.path(svgStr);
	c3.attr({
		fill: 'rgba(0,0,0,0.4)'
	});
}

R.change(redraw);
r.change(redraw);
cx.change(redraw);
cy.change(redraw);
xGap.change(redraw);
yGap.change(redraw);

redraw();