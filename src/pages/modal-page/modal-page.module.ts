import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CityModalPage } from './city-modal-page';
import { VideoModalPage } from './video-modal-page';

@NgModule({
    declarations: [
        CityModalPage,
        VideoModalPage
    ],
    imports: [
        IonicPageModule.forChild(CityModalPage),
        IonicPageModule.forChild(VideoModalPage),
    ],
    entryComponents: [
        CityModalPage, VideoModalPage
    ]
})
export class ModalPageModule { }