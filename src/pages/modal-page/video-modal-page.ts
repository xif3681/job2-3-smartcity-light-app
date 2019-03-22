import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
    templateUrl: 'video-modal-page.html'
})
export class VideoModalPage {


    videoUrl: string;


    constructor(
        public viewCtrl: ViewController,
        params: NavParams
    ) {

        this.videoUrl = params.get('videoUrl');

    }

    dismissOk() {
        let data = { 'city': '返回' };
        this.viewCtrl.dismiss(data);
        // this.viewCtrl.dismiss();
    }
    dismissClose() {
        this.viewCtrl.dismiss();
    }

  
}