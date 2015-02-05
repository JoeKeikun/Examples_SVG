var borderPath = $('#board-path'),
    fibonaqiPath = $('#fibonaqi-path'),
    linePath = $('#line-path'),
    svg = $('#svg');

var startrPoint = {
        x: 245,
        y: 410
    },
    unit = 5,
    clockwiseFlg = true,
    board,
    spiral;

var snap = new Snap(800, 800);

function draw() {
    var d = '',
        d2 = '',
        d3 = '',
        i;

    var res = Fibonacci(startrPoint, unit, 12, clockwiseFlg, Fibonacci.DIRECTION_LEFT);
    board = res.board;
    spiral = res.spiral;

    var p1 = snap.path(board.path);
    p1.attr({
        fill: "none",
        stroke: "#d2d2d2",
        strokeWidth: 1,
        strokeDasharray: board.length,
        strokeDashoffset: board.length
    });

    var p2 = snap.path(spiral.path);
    p2.attr({
        fill: "none",
        stroke: "#d2d2d2",
        strokeWidth: 1,
        strokeDasharray: spiral.length,
        strokeDashoffset: spiral.length
    });

    Snap.animate(0, 1, function(val) {
        p1.attr({
            strokeDashoffset: (1 - val) * board.length
        });
    }, 1500, function() {
        Snap.animate(0, 1, function(val) {
            p2.attr({
                strokeDashoffset: (1 - val) * spiral.length
            });
        }, 800);
    });
}

draw();