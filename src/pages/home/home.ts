import { Component, ElementRef, ViewChild} from '@angular/core';
import { NavController, ModalController, Platform, AlertController } from 'ionic-angular';
import { HomeService } from '../../service/home.service';
import { CityModalPage } from '../modal-page/city-modal-page';
import { ToastController } from 'ionic-angular';
// import { GradOverlar } from '../../service/grad.overlay';
import { CircleOverlayService } from '../../service/circle-overlay.service';

// baidu map
// baidu map
declare var BMap;
declare let BMAP_ANCHOR_TOP_LEFT;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage  {
  @ViewChild('map5') map_container: ElementRef;
  platform: string;
  map: any;地图
  showBaiduPanel: boolean = false;
  InfoW: any; // 弹框
  marker: any;
  markers: any; // 标注
  mySquare: any; // 标注
  label: any; // 标注
  point: any; // 点
  device: any; // 点击的路灯
  // username: string = "";
  timer: any; // 定时器
  lightList = []; // 当前数据
  control = false; // 路灯控制
  brightness = 0; // 路灯控制 亮度
  LightsContrMess = ''; // 路灯控制 信息

  public event = { // 路灯控制 时间
    month: '1990-02-19',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  }

  cityList: any; // 城市列表
  deviceList: any; // 城市列表
  defaultZone: any; // 默认城市


  node: any;
  parentNode: any;
  // currentChildren: any; // 当前城市节点
  currentCity: any; // 当前城市
  currentProvince: any;
  currentRegion: any;
  currentStreet: any;
  city: any;


  pet: string = "Handle1";
  strLocate: string;
  strDevice: string;
  resultPos: any; // 查询到的位置


  constructor(public plt: Platform, public navCtrl: NavController, private lightService: HomeService,
      public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController) {

    if (this.plt.is('ios')) {
      // This will only print when on iOS
      this.platform = 'ios';
      console.log('I am an iOS device!');
    } else if (this.plt.is('android')) {
      this.platform = 'md';
      console.log('I am an iOS android!');
    } else {
      this.platform = 'ios';
      console.log('I am an iOS device!');
    }

    // 更改初始时间为 当前时间加一小时
    const Dates = new Date();
    const hourNum = Dates.getHours() + 1;
    const Hours = hourNum < 10 ? '0' + hourNum : hourNum;
    const Minutes = Dates.getMinutes() < 10 ? '0' + Dates.getMinutes() : Dates.getMinutes();
    this.event.timeStarts = Hours + ':' + Minutes;
    // console.log('foo');
    // console.log(params.get('foo'));

  }

  ionViewDidLoad() {
    this.getCity();
  }

  ionViewDidEnter() {
    this.lightList = [];
    this.addBeiduMap();

  }

  // 按键点击事件
  execQuery() {

    const that = this;
    this.map.closeInfoWindow(this.InfoW); // 开启信息窗口
    if (this.mySquare) {
      this.map.removeOverlay(this.mySquare);
    }
    if (this.pet === 'Handle1') { // 位置搜索
      if (this.strLocate === '' || !this.strLocate) {
        this.showToast('bottom', 'Empty Input!');
      } else {
        that.showBaiduPanel = true;
        const map = that.map;
        setTimeout(() => {
          let local = new BMap.LocalSearch(map, {
            renderOptions: {map: map, panel: "r-result"},
            pageCapacity:10,
            // onSearchComplete: function(results) {
              // const res1 = document.getElementById('r-result');
              // const res = res1.getElementsByTagName('li').item(1);
              // const res = res1.querySelectorAll('.locate-res');
              // console.log(typeof(res));
              // console.log(res1);
              // console.log(res);
              // const elem = res.item;
              // console.log(elem);
              // for (let i = 0; i < res.length; i++) {
              //   console.log('2222222222');
              //   res[i].addEventListener('click', function () {
              //     console.log('1211111111');
              //   });
              // }
            // }
          });
          // console.log('that.strLocate' + that.strLocate);
          local.search(that.strLocate);
        }, 1);
      }
    }
    else if (this.pet === 'Handle2') { // 按位置
      if (this.strDevice === '' || !this.strDevice) {
        this.showToast('bottom', 'Empty Input!');
      } else {
        console.log(1111111111);
        this.getLightByDeviceName();
      }
      
    }
  }
  // 按位置编号搜索
  getLightByDeviceName() {
    const that = this;
    const posNum = this.strDevice;
    console.log('typeof (posNum)');
    console.log(typeof (posNum));
    that.lightService.getLightByDeviceName(posNum).subscribe({
      next: function(val) {
        // that.resultPos = val;
        console.log('val');
        console.log(val);
        const point = new BMap.Point(val.point.lng, val.point.lat);
        that.map.centerAndZoom(point, 18);
        that.getLights();
        that.mySquare = new CircleOverlayService(point, val.name, 128, 38, 'green');
        that.map.addOverlay(that.mySquare);
      },
      complete: function() {



      },
      error: function(error) {
        let message;
        if (error.error.errors) {
          message = error.error.errors[0].defaultMessage;
        } else {
          message = '结果不唯一！';
        }
        
        that.showToast('bottom', message);
        console.log(error);
      }
    });
  }

  // 弹框
  openBasicModal() {
    let myModal = this.modalCtrl.create(CityModalPage);
    myModal.present();
  }
  openModalWithParams() {
    const that = this;
    let myModal = this.modalCtrl.create(CityModalPage, { 'cityList': this.cityList, 'currentProvince': this.currentProvince, 'currentCity': this.currentCity, 'currentRegion': this.currentRegion, 'currentStreet': this.currentStreet});
    myModal.onDidDismiss(data => {
      console.log('city');
      if (data) {
        console.log(data.city);
        that.getPoint(that.map, data.city);  // 解析地址- 设置中心和地图显示级别
        that.city = data.city;
        that.currentProvince = data.currentProvince;
        that.currentCity = data.currentCity;
        that.currentRegion = data.currentRegion;
        that.currentStreet = data.currentStreet;
      }

    });
    myModal.present();
  }

  // 解析地址- 设置中心和地图显示级别
  getPoint(baiduMap, city) {
    const zoom = this.switchZone(city.level);
    console.log(city);
    const pt = city.center;
    const point = new BMap.Point(pt.lng, pt.lat);
    baiduMap.centerAndZoom(point, zoom);


  }

  // 省市区街道-地图级别
  switchZone(level) {
    let zone = 12;
    switch (level) {
      case 1:
        zone = 10;
        break;
      case 2:
        zone = 12;
        break;
      case 3:
        zone = 15;
        break;
      case 4:
        zone = 17;
        break;
      default:
        break;
    }
    return zone;
  }


  // 获取城市列表 --ok
  getCity() {
    const that = this;
    this.lightService.getZoneDefault().subscribe({
      next: function (val) {
        that.cityList = val.regions;

        that.node = that.getNode(val.regions, val.zone.region_id);
        that.currentCity = that.node;
        that.city = that.node;

      },
      complete: function () {


      },
      error: function (error) {
        console.log(error);
      }
    });
  }

  /**
 * 根据NodeID查找当前节点以及父节点
 *
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */

  getNode(json, nodeId) {
    const that = this;

    // 1.第一层 root 深度遍历整个JSON
    for (let i = 0; i < json.length; i++) {
      if (that.node) {
        break;
      }

      const obj = json[i];

      // 没有就下一个
      if (!obj || !obj.id) {
        continue;
      }
      // console.log(nodeId);
      // console.log(obj.id);
      // 2.有节点就开始找，一直递归下去
      if (obj.id === nodeId) {
        // 找到了与nodeId匹配的节点，结束递归
        that.node = obj;

        break;
      } else {

        // 3.如果有子节点就开始找
        if (obj.children) {
          // 4.递归前，记录当前节点，作为parent 父亲
          that.parentNode = obj;

          // 递归往下找
          that.getNode(obj.children, nodeId);
        } else {
          // 跳出当前递归，返回上层递归
          continue;
        }
      }
    }


    // 5.如果木有找到父节点，置为null，因为没有父亲
    if (!that.node) {
      that.parentNode = null;
    }

    // 6.返回结果obj
    // return {
    //   parentNode: that.parentNode,
    //   node: that.node
    // };
    return that.node;
  }


  // 百度地图API功能
  addBeiduMap() {

    let map = this.map = new BMap.Map(this.map_container.nativeElement, { enableMapClick: true });//创建地图实例

    // map.centerAndZoom("广州",17); //设置城市设置中心和地图显示级别
    const point = new BMap.Point(113.923497, 22.497311); // 坐标可以通过百度地图坐标拾取器获取 --万融大厦
    map.centerAndZoom(point, 17);//设置中心和地图显示级别

    // let sizeMap = new BMap.Size(10, 80);//显示位置
    const offset = new BMap.Size(16, 16);
    const navigationControl = new BMap.NavigationControl({
      anchor: BMAP_ANCHOR_TOP_LEFT,
      offset: offset,
    });
    map.addControl(navigationControl);
    // map.addControl(new BMap.NavigationControl());


    map.enableScrollWheelZoom(true);//启动滚轮放大缩小，默认禁用
    map.enableContinuousZoom(true);//连续缩放效果，默认禁用

    // let myIcon = new BMap.Icon("assets/icon/favicon.ico", new BMap.Size(25, 25));

    // let marker = this.marker = new BMap.Marker(point, { icon: myIcon });
    // map.addOverlay(marker);

    this.mapClickOff(map);
    this.dragendOff(map);
    this.zoomendOff(map);

    // setTimeout(() => {
    //   this.getLights(); // 获取地图上的点
    // }, 1000);
    this.getLights(); // 获取地图上的点
    this.timer = setInterval(() => {
      this.getLights(); // 获取地图上的点
    }, 1000 * 10);

}

  // 监控-点击地图事件
  mapClickOff(baiduMap) {
    const that = this;
    baiduMap.addEventListener('click', function (e) {
      that.showBaiduPanel = false; // 点击地图，收起位置面板
      // console.log(88888888888)
      // console.log(e.type)
      // console.log(e.target)
      // console.log(e.point)
      that.point = e.point;
      that.control = false;
      if (that.mySquare) {
        that.map.removeOverlay(that.mySquare);

      }
      
    });
    // baiduMap.addEventListener('dragend', function () {

    // });
    // baiduMap.addEventListener('zoomend', function () {

    // });
  }

  // 监控-拖动地图事件-显示用户拖动地图后地图中心的经纬度信息。
  dragendOff(baiduMap) {
    const that = this;
    baiduMap.addEventListener('dragend', function () {
      that.getLights(); // 获取地图上的点
      if (that.mySquare) {
        that.map.removeOverlay(that.mySquare);

      }
    });
  }

  // 监控-地图缩放事件-地图缩放后的级别。
  zoomendOff(baiduMap) {
    const that = this;
    baiduMap.addEventListener('zoomend', function () {
      that.getLights(); // 获取地图上的点
      if (that.mySquare) {
        that.map.removeOverlay(that.mySquare);

      }

    });

  }


  getLights() {
    const that = this;
    const Bounds = this.map.getBounds(); // 返回地图可视区域，以地理坐标表示
    const NorthEast = Bounds.getNorthEast(); // 返回矩形区域的东北角
    const SouthWest = Bounds.getSouthWest(); // 返回矩形区域的西南角
    let value;
    let compar;
    this.lightService.getLights(NorthEast, SouthWest).subscribe({
      next: function (val) {
        compar = that.comparison(that.lightList, val);
        value = that.judgeChange(compar.a_arr, compar.b_arr);

        that.changeMarker(value); // 替换
        that.deleMarker(compar.a_surplus); // 删除

        that.addMarker(compar.b_surplus); // 添加

        that.lightList = val; // 变为新值

      },
      complete: function () {

      },
      error: function (error) {
        console.log(error);
      }
    });
  }

  // 交并补
  comparison(a, b) {
    const a_arr: any[] = [];
    const b_arr: any[] = [];
    const a_surplus: any[] = [];
    const b_surplus: any[] = [];
    let i = 0;
    if (b.length === 0) {
      while (i < a.length) {
        a_surplus.push(a[i]);
        i++;
      }
    }
    for (let j = 0; j < b.length; j++) {
      while (i < a.length && a[i].id < b[j].id) {
        a_surplus.push(a[i]);
        i++;
      }
      if (i >= a.length || a[i].id > b[j].id) {
        b_surplus.push(b[j]);
      } else {
        a_arr.push(a[i]);
        i++;
        b_arr.push(b[j]);
      }
      while (i < a.length && j === b.length - 1) {
        a_surplus.push(a[i]);
        i++;
      }
    }
    return {
      a_arr: a_arr, // 共同
      b_arr: b_arr, // 共同
      a_surplus: a_surplus, // a - 删除
      b_surplus: b_surplus, // b - 新增
    };
  }

  // 判断变化值
  judgeChange(a, b) {
    const changePoint: any[] = [];
    const length = a.length < b.length ? a.length : b.length;
    for (let index = 0; index < length; index++) {
      const a_element = a[index];
      const b_element = b[index];
      if (a_element.error !== b_element.error ||
        a_element.offline !== b_element.offline ||
        a_element.current !== b_element.current ||
        a_element.volt !== b_element.volt ||
        a_element.level !== b_element.level 
      ) {
        changePoint.push(b_element);
      }

    }
    return changePoint;

  }

  // 替换
  changeMarker(light_list) {
    this.deleMarker(light_list); // 删除
    this.addMarker(light_list); // 添加
  }
  // 删除
  deleMarker(light_list) {
    const makers = this.map.getOverlays();
    for (let ind = 0; ind < light_list.length; ind++) {
      // const ele = light_list[ind];
      const point = light_list[ind].point;
      for (let index = 0; index < makers.length; index++) {
        const element = makers[index];
        const lat = element.point && element.point.lat;
        const lng = element.point && element.point.lng;
        if (point.lat === lat && point.lng === lng) {
          this.map.removeOverlay(makers[index]);
        }

      }
    }
  }


  // 地图上描点
  addMarker(light_list) {
    const markers: any[] = [];
    const points: any[] = [];
    for (let index = 0; index < light_list.length; index++) {
      const item = light_list[index];
      const point = new BMap.Point(item.point.lng, item.point.lat);

      let myIcon;
      if (item.offline === true || item.error === true) { // 异常
        myIcon = new BMap.Icon('assets/imgs/light-breakdown.png', new BMap.Size(36, 36));

      } else if (item.level === 0) { // 正常,没亮
        myIcon = new BMap.Icon('assets/imgs/light-normal.png', new BMap.Size(36, 36));

      } else if (item.level < 30) { // 一级亮度
        myIcon = new BMap.Icon('assets/imgs/light-up-1.png', new BMap.Size(36, 36));
      } else if (item.level < 70) { // 二级亮度
        myIcon = new BMap.Icon('assets/imgs/light-up-2.png', new BMap.Size(36, 36));
      } else { // 三级亮度
        myIcon = new BMap.Icon('assets/imgs/light-up-3.png', new BMap.Size(36, 36));
      }

      // myIcon.setAnchor(new BMap.Size(16, 38));
      const marker = new BMap.Marker(point, { icon: myIcon });  // 创建标注
      this.map.addOverlay(marker);
      markers.push(marker); // 聚合

      this.markers = markers;
      points.push(point); // 聚合
    }

    // 点击点标注事件 - 弹出信息框
    for (let index = 0; index < markers.length; index++) {
      const marker = markers[index];
      this.openSideBar(marker, this.map, light_list[index], points[index]);


    }
  }

  // 地图点注标-点击事件
  openSideBar(marker, baiduMap, val, point) {
    // console.log(val);
    const that = this;
    // <p style=’font - size: 12px; lineheight: 1.8em; ’> ${ val.name } </p>
    // const opts = {
    //   width: 0,     // 信息窗口宽度
    //   height: 0,     // 信息窗口高度
    //   title: `编号： ${val.positionNumber}`, // 信息窗口标题
    //   // enableMessage: true, // 设置允许信息窗发送短息
    //   enableAutoPan: true, // 自动平移
    // };
    // let txt = `位置编号： ${val.positionNumber}`;
    // let txt = `<p>设备编号： ${val.name}</p>`;
    let txt = `<p style='font-size: 12px; line-height: 1.8em; border-bottom: 1px solid #ccc; padding-bottom: 10px;'>设备编号 | ${val.name} </p>`;
    // let txt = `
    // <p >编号： ${val.positionNumber}</p>

    // `;
  //  let  txt =
  //     `<p>编号： ${val.positionNumber}</p>
  //    `;

    // if (val.offline === true) {// 离线
    //   // 离线或异常
    //   txt = txt + `   <p style="color: red">是否在线： 否</p>`;
    // } else {
    //   txt = txt + `   <p >是否在线： 是</p>`;
    // }

    // if (val.error === true) {// 离线
    //   // 离线或异常
    //   txt = txt + `<p style="color: red">是否故障： 是</p>`;
    // } else {
    //   txt = txt + `<p >是否故障： 否</p>`;
    // }
    // if (val.rule && val.rule.name) {
    //   txt = txt + `<p >应用策略： ${val.rule.name}</p>`;
    // } else {
    //   txt = txt + `<p >应用策略：无</p>`;
    // }
    txt = txt + `<p >亮度级别： ${val.level}%</p>`;
    // txt = txt + `<p >电流强度： ${val.current}毫安(mA)</p>`;
    // txt = txt + `<p >电压大小： ${val.volt}毫伏(mv)</p>`;
    // txt = txt + `<button class='lsq-h-btn' onClick='deviceAddEventListener1()'
    // txt = txt + `<button class='lsq-h-btn' 
    //   id='luosq${val.id}'>亮度调节</button>`;

    // var infoWindow = this.InfoW = new BMap.InfoWindow(txt);  // 创建信息窗口对象
    // map.openInfoWindow(infoWindow, point); //开启信息窗口


   // const infoWindow = new BMap.InfoWindow(txt, opts);
    // 点击标注

    marker.addEventListener('click', function () {
     // that.closeDevicesControl();
      that.device = val;
      console.log(val);
      that.brightness = that.device.level;
      // baiduMap.openInfoWindow(infoWindow, point); // 开启信息窗口
      that.getLights(); // 获取地图上的点
      that.map.centerAndZoom(point, 18);//设置中心和地图显示级别

      if (that.mySquare) {
        that.map.removeOverlay(that.mySquare);

      }

      if (that.label) {
        that.map.removeOverlay(that.label);

      }


      // that.getLights(); // 获取地图上的点
      setTimeout(() => {


        that.deviceAddEventListener();
        // console.log(marker);
        // that.map.removeOverlay(marker);
        // that.mySquare = new GradOverlar(point, 60, 'tag-bule');
        that.mySquare = new CircleOverlayService(point, val.name, 128, 38, 'green');
        that.map.addOverlay(that.mySquare);
        // var opts = {
        //   position: point,    // 指定文本标注所在的地理位置
        //   offset: new BMap.Size(0, -30)    //设置文本偏移量
        // }
        // var label = that.label= new BMap.Label(`亮度级别： ${val.level}%`, opts);  // 创建文本标注对象
        // label.setStyle({
        //   color: "red",
        //   fontSize: "12px",
        //   height: "20px",
        //   lineHeight: "20px",
        //   fontFamily: "微软雅黑"
        // });
        // that.map.addOverlay(label);   

      }, 2);
    });

  }

  deviceAddEventListener() { // 直接在html写onclik没用
   this.control = true;

  }

  lightClose() {
    this.control = !this.control;
  }

  // 路灯- 临时控制-接口
  setLightsContr(id) {
    const that = this;
    let stopTime: { hour: number, minute: number }; // 路灯控制时间
    const timeStarts = this.event.timeStarts.split(':');
    stopTime = {
      hour: Number(timeStarts[0]),
      minute: Number(timeStarts[1])
    }
    const level = this.brightness;
    this.lightService.setLightsContr(id, level, stopTime).subscribe({
      next: function (val) {
        that.LightsContrMess = '修改成功！';
        that.showAlert()
        console.log('ok!');
      },
      complete: function () {
        that.getLights(); // 获取地图上的点

      },
      error: function (error) {
        console.log(error);
      }
    });
  }
// 提示框
  showAlert() {
    const that = this;
    const alert = this.alertCtrl.create({
      title: '提示',
      subTitle: '修改成功！',
      buttons: [
        {
          text: 'OK', 
          handler: () => {
            that.control = !that.control;
          }
        }
  ]
    });
    alert.present();
  }




  showToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

    toast.present(toast);
  }

  ionViewDidLeave() {
    window.clearInterval(this.timer);
    this.control = false;
  }

}
