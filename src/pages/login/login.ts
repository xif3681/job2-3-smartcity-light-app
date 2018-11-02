import { Component } from '@angular/core';
import {  NavController, NavParams, Platform } from 'ionic-angular';
import { TabsPage } from "../tabs/tabs";
import { AuthService } from '../../service/auth.service';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userData: any = {}; // 存储数据;
  platform: string;
  loading = false;
  error: any;

  constructor(public plt: Platform, public navCtrl: NavController, public navParams: NavParams, public authService: AuthService,) {
    this.userData.username = '';
    this.userData.password = '';
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
  }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  // logIn(username: HTMLInputElement, password: HTMLInputElement) {
  logIn() {
    const username = this.userData.username;
    const password = this.userData.password;
    if (username.length == 0) {
      this.error = "请输入账号";
    } else if (password.length == 0) {
      this.error = "请输入密码";
    } else {

      this.login();

    }


  }

  login() {
    const that = this;
    this.loading = true;
    // this.authService.login1(this.model.username, this.model.password).subscribe(() => {});

    this.authService.login(this.userData.username, this.userData.password)
      .subscribe({
        next: function (val) {
          if (that.authService.isLoggedIn) {
            that.navCtrl.push(TabsPage);
          } else {
            that.error = '登录失败!';
            that.loading = false;
          }
        },
        complete: function () { },
        error: function (error) {
          console.log(error)
          if (error.error) {
            const errormes = JSON.parse(error.error);
            that.error = errormes.errors[0].defaultMessage;
          } else {
            that.error = error;
          }

          that.loading = false;
        }
      });
  }

}
