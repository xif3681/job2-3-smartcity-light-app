import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from './home.service';
import { AuthService } from './auth.service';
import { ContactService } from './contact.service';
import { VideoService } from './video.sevice';



@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [HomeService, AuthService, ContactService, VideoService ]
})
export class ServiceModule { }
