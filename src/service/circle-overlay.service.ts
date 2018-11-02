// 继承API的BMap.Overlay
declare let BMap;

export function CircleOverlayService(center, name, w, h, color) {
    // console.log(this);
    this._center = center;
    this._lengthh = h;
    this._lengthw = w;
    this._name = name;
    // this._level = level;
    this._color = color;
}

CircleOverlayService.prototype = new BMap.Overlay();

// 实现初始化方法
CircleOverlayService.prototype.initialize = function (map) {
    const that = this;
    // 保存map对象实例
    this._map = map;
    // 创建div元素，作为自定义覆盖物的容器
    const div = document.createElement('div');
    div.style.zIndex = '999';
    div.style.position = 'absolute';
    // 可以根据参数设置元素外观
    // div.style.width = this._length + 'px';
    // div.style.height = this._length + 'px';
    // div.style.lineHeight = this._length + 'px';
    // div.style.background = this._color;
    // div.style.paddingTop = 7 + 'px';
    // div.className = 'i-circle';
    div.className = 'tag-green';
    // 将div添加到覆盖物容器中
    map.getPanes().markerPane.appendChild(div);
    // 保存div实例
    this._div = div;
    // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
    // hide方法，或者对覆盖物进行移除时，API都将操作此元素。

    const span1 = this._span = document.createElement('span1');
    // const span2 = this._span = document.createElement('span2');
    // const span2 = this._span2 = document.createElement('span');
    const br = document.createElement('br');
    div.appendChild(span1);
    div.appendChild(br);
    // div.appendChild(span2);
    span1.appendChild(document.createTextNode('编号：' + this._name));
    // span2.appendChild(document.createTextNode(this._level+'%'));



    // const arrow = this._arrow = document.createElement('div');

    div.onmouseover = function () {
        this.style.zIndex = '1000';
        // this.style.borderColor = '#0000ff';
        // this.getElementsByTagName('span')[0].innerHTML = that._overText;
        // arrow.style.backgroundPosition = '0px -20px';
    };

    div.onmouseout = function () {
        this.style.backgroundColor = that._color;
        this.style.zIndex = '999';
        // this.style.borderColor = "#BC3B3A";
        // this.getElementsByTagName("span")[0].innerHTML = that._text;
        // arrow.style.backgroundPosition = "0px 0px";
    };

    return div;
};

// 实现绘制方法
CircleOverlayService.prototype.draw = function () {
    // 根据地理坐标转换为像素坐标，并设置给容器
    const position = this._map.pointToOverlayPixel(this._center);
    console.log(position)
    this._div.style.left = position.x - 51  + 'px';
    this._div.style.top = position.y  - 57 + 'px';

    console.log(this._div.style.left)
    console.log(this._div.style.top)
    // this._div.style.left =  137 + 'px';
    // this._div.style.top = 228 + 'px';
};

// 实现显示方法
CircleOverlayService.prototype.show = function () {
    if (this._div) {
        this._div.style.display = '';
    }
};
// 实现隐藏方法
CircleOverlayService.prototype.hide = function () {
    if (this._div) {
        this._div.style.display = 'none';
    }
};
// 添加自定义方法
CircleOverlayService.prototype.toggle = function () {
    if (this._div) {
        if (this._div.style.display === '') {
            this.hide();
        } else {
            this.show();
        }
    }
};
