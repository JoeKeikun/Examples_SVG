var IndexBar = function(options) {
    var me = this;
    var circleAssistant, circleMain, pathAssistant1, pathAssistant2;

    me.index = 0;
    me.length = 0;

    // 配置
    me.setOptions(options);

    /* 侵入性代码 */
    // 创建组建区域
    me.component = Snap(me.options.BAR_HALF_WIDTH * 2, 250);

    // 创建posGroup，将占位点放置在posGroup组里面
    me.posGroup = me.component.g();

    // 配置active点
    me.indexGroup = me.component.g();
    // 圆Assistant
    circleAssistant = me.component.circle(me.options.BAR_HALF_WIDTH, me.options.ACTIVE_RADIUS, me.options.EMPTY_RADIUS);
    circleAssistant.attr({
        fill: me.options.ACTIVE_COLOR
    });
    // 圆Main
    circleMain = me.component.circle(me.options.BAR_HALF_WIDTH, me.options.ACTIVE_RADIUS, me.options.ACTIVE_RADIUS);
    circleMain.attr({
        fill: me.options.ACTIVE_COLOR
    });
    // 衔接1
    pathAssistant1 = me.component.path('');
    pathAssistant1.attr({
        fill: me.options.ACTIVE_COLOR
    });
    // 衔接2
    pathAssistant2 = me.component.path('');
    pathAssistant2.attr({
        fill: me.options.ACTIVE_COLOR
    });
    me.indexGroup.add(circleMain, circleAssistant, pathAssistant1, pathAssistant2);

    // 默认添加1个点
    me.addDot();
};

//设置默认属性
IndexBar.prototype.setOptions = function(options) {
    var me = this;

    me.options = { //默认值
        BAR_HALF_WIDTH: 10, // 整个滚动条的一半宽度
        GAP: 28, // 两个点之间的距离
        EMPTY_RADIUS: 4, // 活动点半径
        EMPTY_COLOR: '#3886d0', //'#84bae9',
        ACTIVE_RADIUS: 9, // 目标点半径
        ACTIVE_COLOR: '#3886d0',
        WATER_WIDTH: 1.5, // 水滴线宽度
        WATER_BREAK: 11, // 水滴截断位置
        WATER_RESTRICT: 23, // 水滴形成最大贝塞尔曲线的终点y轴位置（大于大圆半径，小于两圆圆周连直线的间距）
        ANIMATION_TIME: 800, // 水滴动画时间
        TIMING_FUNCTION: 'linear' // 水滴动画时间曲线
    };

    for (var property in options) {
        me.options[property] = options[property];
    }
},

// 数据结构
IndexBar.prototype.index = null;
IndexBar.prototype.length = null;

// 组件对象索引
IndexBar.prototype.component = null;
IndexBar.prototype.posGroup = null;
IndexBar.prototype.indexGroup = null;
IndexBar.prototype.inAnimation = false;


IndexBar.prototype.addDot = function() {
    var me = this;
    var len, circle;

    len = me.length;

    // 绘制圆点
    circle = me.component.circle(me.options.BAR_HALF_WIDTH, len * me.options.GAP + me.options.ACTIVE_RADIUS, me.options.EMPTY_RADIUS);
    circle.attr({
        fill: me.options.EMPTY_COLOR,
        stroke: 'transparent',
        'stroke-width': 10
    });

    circle.click(function() {
        if (!me.inAnimation) {
            var clickCircle = this;

            var activeY = me.index * me.options.GAP + me.options.ACTIVE_RADIUS;
            var y = parseInt(clickCircle.attr('cy'));

            me.moveIndex(y - activeY);
        }
    });

    // 缓存
    me.posGroup.add(circle);
    me.length++;
};

IndexBar.prototype.delDot = function() {
    var me = this;
    var circle;

    // 销毁圆和数据
    circle = me.posGroup[me.length - 1];
    circle.unclick();
    circle.remove();
    me.posGroup.removeData(circle);
    me.length--;

    if (me.index >= me.length && me.length !== 0) {
        me.index--;
    }
};

// 移动index点
IndexBar.prototype.moveIndex = function(realGap, fn) {
    var me = this;

    var pathAssistant1 = me.indexGroup[2],
        pathAssistant2 = me.indexGroup[3],
        circleAssistant = me.indexGroup[1],
        circleMain = me.indexGroup[0];

    var posY = me.index * me.options.GAP + me.options.ACTIVE_RADIUS; // 起始点的y轴坐标

    var direction = realGap / Math.abs(realGap);
    realGap = Math.abs(realGap);

    var step1 = 0.15, // 步骤一的长度，起始点向目标点伸出
        step2 = 0.55, // 步骤二的长度，起始点的辅助点收回到断水点，且目标点的辅助点开始伸出
        step3 = 0.85, // 步骤三的长度，起始点的半径缩小为最小值，且目标点的辅助点开始收回
        step4 = 1; // 步骤四的长度，目标点扩张成最大值

    me.inAnimation = true;
    var smallWaterWidth = 0.8;

    doAnimate(function(p) {
        // 绘制的参数
        var mainR = me.options.EMPTY_RADIUS, // 起始点的半径
            mainY = posY, // 起始点的坐标
            assistantR = me.options.EMPTY_RADIUS, // 目标点的半径
            assistantY = posY + realGap * direction, // 目标点的坐标
            tmpR = me.options.WATER_WIDTH,
            tmpPath1 = '', // 起始点和目标点的路径
            tmpPath2 = ''; // 起始点和目标点的路径

        // 实时参数
        var percent = timingfn[me.options.TIMING_FUNCTION](p > 1 ? 1 : p), // 百分比参数
            bezier1, //贝塞尔弧线的高度1
            res1, //贝塞尔弧线结果1的暂存
            bezier2, //贝塞尔弧线的高度2
            res2; //贝塞尔弧线结果2的暂存


        // 计算起始点的参数
        if (percent <= step3) {
            // 起始点在［0, step2］时，半径缩小成最小
            if (percent <= step2) {
                mainR = me.options.ACTIVE_RADIUS - percent / step2 * (me.options.ACTIVE_RADIUS - me.options.EMPTY_RADIUS); //起始点半径
            }

            // [0, step1]时，尾巴伸长
            if (percent <= step1) {
                bezier1 = me.options.ACTIVE_RADIUS + (realGap - me.options.ACTIVE_RADIUS - me.options.EMPTY_RADIUS) * (percent / step1); //计算起始点的尾巴
            }
            // (step1, step2]时，尾巴缩短到断开点
            else if (percent <= step2) {
                bezier1 = realGap - (percent - step1) / (step2 - step1) * (realGap - me.options.WATER_BREAK); //计算起始点的尾巴
            }
            // (step2, step3]时，尾巴缩短到圆周上 
            else {
                bezier1 = me.options.WATER_BREAK - ((percent - step2) / (step3 - step2)) * (me.options.WATER_BREAK - me.options.EMPTY_RADIUS); //计算起始点的尾巴
            }
        }

        // 计算目标点的参数
        if (percent > step1) {
            // 目标点在［step1, step4］区间时，半径增长到最大
            assistantR = me.options.EMPTY_RADIUS + (percent - step1) / (step4 - step1) * (me.options.ACTIVE_RADIUS - me.options.EMPTY_RADIUS); // 目标点半径

            if (assistantR < me.options.ACTIVE_RADIUS) {
                // [step1, step2]时，尾巴伸长
                if (percent < step2) {
                    bezier2 = me.options.EMPTY_RADIUS + (percent - step1) / (step2 - step1) * (realGap - me.options.WATER_BREAK - me.options.EMPTY_RADIUS); //计算目标点的尾巴
                }
                // (step2, step4]时，尾巴缩回
                else {
                    bezier2 = realGap - me.options.WATER_BREAK - ((percent - step2) / (step4 - step2)) * (realGap - me.options.WATER_BREAK - me.options.ACTIVE_RADIUS); //计算目标点的尾巴
                }
            }
        }

        var tmpPercent = (step1 / 3 + step2 * 2 / 3);
        if (percent < step2) {
            if (percent > tmpPercent) {
                tmpR = me.options.WATER_WIDTH - (me.options.WATER_WIDTH - smallWaterWidth) * (percent - tmpPercent) / (step2 - tmpPercent);
            }
        } else {
            tmpR = smallWaterWidth;
        }

        // 计算起始点到辅助点的水滴路径
        if (bezier1 > 0) {
            // 画直线
            tmpPath1 += 'M' + (me.options.BAR_HALF_WIDTH + tmpR) + ',' + posY;
            tmpPath1 += ' L' + (me.options.BAR_HALF_WIDTH + tmpR) + ',' + (posY + bezier1 * direction);
            tmpPath1 += ' A ' + tmpR + ' ' + tmpR + ', 0, 0, ' + (direction > 0 ? 1 : 0) + ', ' + (me.options.BAR_HALF_WIDTH - tmpR) + ' ' + (posY + bezier1 * direction);
            tmpPath1 += ' L' + (me.options.BAR_HALF_WIDTH - tmpR) + ',' + posY + ' Z';

            if (bezier1 > me.options.WATER_RESTRICT) {
                bezier1 = me.options.WATER_RESTRICT;
            }
            res1 = bezierPath(me.options.BAR_HALF_WIDTH, mainY, 0, bezier1 * direction, mainR, tmpR);
            tmpPath1 += ' M' + res1.x1 + ',' + res1.y1;
            tmpPath1 += ' C' + res1.x2 + ',' + res1.y2 + ' ' + res1.x3 + ',' + res1.y3 + ' ' + res1.x4 + ',' + res1.y4;
            tmpPath1 += ' L' + res1.x8 + ' ' + res1.y8;
            tmpPath1 += ' C' + res1.x7 + ',' + res1.y7 + ' ' + res1.x6 + ',' + res1.y6 + ' ' + res1.x5 + ',' + res1.y5;
            tmpPath1 += ' L' + res1.x1 + ',' + res1.y1 + ' Z';
        }

        // 计算目标点到辅助点的水滴路径
        if (bezier2 > 0) {
            // 画直线
            tmpPath2 += 'M' + (me.options.BAR_HALF_WIDTH + tmpR) + ',' + (posY + realGap * direction);
            tmpPath2 += ' L' + (me.options.BAR_HALF_WIDTH + tmpR) + ',' + (posY + (realGap - bezier2) * direction);
            tmpPath2 += ' A' + tmpR + ' ' + tmpR + ', 0, 0, ' + (direction > 0 ? 0 : 1) + ', ' + (me.options.BAR_HALF_WIDTH - tmpR) + ' ' + (posY + (realGap - bezier2) * direction);
            tmpPath2 += ' L' + (me.options.BAR_HALF_WIDTH - tmpR) + ',' + (posY + realGap * direction) + ' Z';

            if (bezier2 > me.options.WATER_RESTRICT) {
                bezier2 = me.options.WATER_RESTRICT;
            }
            res2 = bezierPath(me.options.BAR_HALF_WIDTH, assistantY, 0, -bezier2 * direction, assistantR, tmpR);
            tmpPath2 += ' M' + res2.x1 + ',' + res2.y1;
            tmpPath2 += ' C' + res2.x2 + ',' + res2.y2 + ' ' + res2.x3 + ',' + res2.y3 + ' ' + res2.x4 + ',' + res2.y4;
            tmpPath2 += ' L' + res2.x8 + ' ' + res2.y8;
            tmpPath2 += ' C' + res2.x7 + ',' + res2.y7 + ' ' + res2.x6 + ',' + res2.y6 + ' ' + res2.x5 + ',' + res2.y5;
            tmpPath2 += ' L' + res2.x1 + ',' + res2.y1 + ' Z';
        }

        // 描绘图形
        circleMain.attr({
            r: mainR,
            cy: mainY
        });
        circleAssistant.attr({
            r: assistantR,
            cy: assistantY
        });
        pathAssistant1.attr({
            path: tmpPath1
        });
        pathAssistant2.attr({
            path: tmpPath2
        });

        // 执行回调
        if (percent >= 1) {
            me.index += realGap * direction / me.options.GAP;
            // 重置数据
            circleMain.attr({
                cy: posY + realGap * direction
            });
            circleAssistant.attr({
                cy: posY + realGap * direction
            });
            me.inAnimation = false;

            // 有回调时，执行回调
            if (fn) {
                fn();
            }
        }
    }, me.options.ANIMATION_TIME);
}