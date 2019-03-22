import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { ContactService } from '../../service/contact.service';
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  pet: string = "Handle1";
  userId: string = "";
  evenList = {};
  token:any;
  evenNone = [false, false, false]

  constructor(public navCtrl: NavController, public jwtHelper: JwtHelperService, private storage: Storage,
    public contactService: ContactService) {
      this.evenList[0] = [];
      this.evenList[1] = [];
      this.evenList[2] = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad contactPage'); 
  }
  ionViewDidEnter(){
    this.getToken();
  }
  getToken() {
    const that = this;
    this.storage.get('access_token').then((token) => {
      that.token = token;
      that.userId = that.jwtHelper.decodeToken(token).userid;
      that.getAllIssuesByUser(1, 0, 0); // state:1; open -> 待处理
      that.getAllIssuesByUser(2, 0, 1); // state:2; open -> 处理中
      that.getAllIssuesByUser(2, 1, 2); // state:2; closed -> 已完成
    });

  }

    // 获取用户相关处理事件
    getAllIssuesByUser(state, isclosed, index) {
      const that = this;
      this.contactService.getAllIssuesByUser(this.userId, state, isclosed).subscribe({
        next: function (val) {
          that.evenList[index] = val;
          if (!val || val.length === 0) {
            that.evenNone[index] = true;
          }
          // console.log(val);
        },
        complete: function () {},
        error: function (error) {
          console.log(error);
        }
      });
    }
  
    setOneStateByUser(issueId, state, comment, orgState) {
      const that = this;
      this.contactService.setOneStateByUser(issueId, state, comment, orgState, this.userId).subscribe({
        next: function (val) {},
        complete: function () {
          that.getAllIssuesByUser(1, 0, 0);
          that.getAllIssuesByUser(2, 0, 1);
        },
        error: function (error) {
          console.log(error);
        }
      });
    }

}
