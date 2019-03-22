import { Component } from '@angular/core';
import { NavController, NavParams, ModalController} from 'ionic-angular';
import { VideoService } from '../../service/video.sevice';
import { VideoModalPage } from '../modal-page/video-modal-page';
/**
 * Generated class for the VideoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-video',
  templateUrl: 'video.html',
})
export class VideoPage {
  valueList: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private videoService: VideoService,
    public modalCtrl: ModalController) {
    this.valueList = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoPage');
    this.getCameras();
  }

  // 获取指定坐标范围的摄像头
  getCameras() {
    const that = this;
    const NorthEast = {
      lat: 22.527877,
      lng: 113.963579
    }; // 返回矩形区域的东北角
    const SouthWest = {
      lat: 22.465236,
      lng: 113.881079
    }; // 返回矩形区域的西南角

    this.videoService.getCameras(NorthEast, SouthWest).subscribe({
      next: function (val) {
        that.valueList = val;
      },
      complete: function () {
      },
      error: function (error) {
        console.log(error);
      }
    });
  }

  palyVideo(item) {
    const that = this;
    let myModal = this.modalCtrl.create(VideoModalPage, { 'videoUrl': item.videoUrl });
    myModal.onDidDismiss(data => {
      if (data) {
        console.log(data);

      }

    });
    myModal.present();
  }

}
