import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CityModalPage } from './city-modal-page';

@NgModule({
    declarations: [
        CityModalPage,
    ],
    imports: [
        IonicPageModule.forChild(CityModalPage),
    ],
    entryComponents: [
        CityModalPage,
    ]
})
export class ModalPageModule { }