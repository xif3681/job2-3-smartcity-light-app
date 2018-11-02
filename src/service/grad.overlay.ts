// 继承API的BMap.Overlay
declare let BMap;


export function GradOverlar(center, length, className) {

    this._center = center;
    this._length = length;

    this._className = className;
}

GradOverlar.prototype = new BMap.Overlay();

// 实现初始化方法
GradOverlar.prototype.initialize = function (map) {
    const that = this;
    // 保存map对象实例
    this._map = map;

    // 创建div元素，作为自定义覆盖物的容器
    const div = document.createElement('div');


    div.style.zIndex = '10000';
    div.style.position = 'absolute';
    // 可以根据参数设置元素外观
    div.style.width = this._length + 'px';
    div.style.height = this._length + 'px';
    // div.style.background = 'green';

    // div.className = this._className;


    // 将div添加到覆盖物容器中
    map.getPanes().markerPane.appendChild(div);
    // 保存div实例
    this._div = div;
    // console.log(this._className);
    // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
    // hide方法，或者对覆盖物进行移除时，API都将操作此元素。

    const div1 = this._span = document.createElement('div');
    div1.className = this._className;
    // div1.className = 'tag-grad';
    div.appendChild(div1);
    // span.appendChild(document.createTextNode(this._className));


    // const arrow = this._arrow = document.createElement('div');

    div.onmouseover = function () {
        this.style.backgroundColor = that._mouseoverColor;
        this.style.zIndex = '1000';

    };

    div.onmouseout = function () {
        this.style.backgroundColor = that._color;
        this.style.zIndex = '999';

    };

    return div;
};

// 实现绘制方法
GradOverlar.prototype.draw = function () {
    // 根据地理坐标转换为像素坐标，并设置给容器
    const position = this._map.pointToOverlayPixel(this._center);
    this._div.style.left = position.x - this._length / 2 + 'px';
    this._div.style.top = position.y - this._length / 2 + 'px';
};

// 实现显示方法
GradOverlar.prototype.show = function () {
    if (this._div) {
        this._div.style.display = '';
    }
};
// 实现隐藏方法
GradOverlar.prototype.hide = function () {
    if (this._div) {
        this._div.style.display = 'none';
    }
};
// 添加自定义方法
GradOverlar.prototype.toggle = function () {
    if (this._div) {
        if (this._div.style.display === '') {
            this.hide();
        } else {
            this.show();
        }
    }
};
