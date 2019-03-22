import { Component } from '@angular/core';
import { NavController, App, AlertController ,} from 'ionic-angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  model: any = {}; // 存储数据
  username: string = "";

  constructor(public navCtrl: NavController, private appCtrl: App, public alertCtrl: AlertController, public jwtHelper: JwtHelperService, private storage: Storage) {
  }

  ionViewDidLoad() {

    this.getToken();
  }

  getToken() {
    const that = this;
    this.storage.get('access_token').then((token) => {
      console.log(token);
      const token1 = that.jwtHelper.decodeToken(token);
      console.log(token1);
      that.username = that.jwtHelper.decodeToken(token).sub;

    });

  }
  logout() {
    const confirm = this.alertCtrl.create({
      title: '提示',
      message: '你确定要退出应用吗？',
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '确定',
          handler: () => {
            window.localStorage.removeItem('access_token');
            this.storage.remove('access_token');
            this.appCtrl.getRootNav().setRoot(LoginPage); //调用this.app.getRootNav() 从根页面跳转就可以了)
          }
        }
      ]
    });
    confirm.present();
  }

}
