import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from './home.service';
import { AuthService } from './auth.service';
import { ContactService } from './contact.service';



@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [HomeService, AuthService, ContactService ]
})
export class ServiceModule { }
