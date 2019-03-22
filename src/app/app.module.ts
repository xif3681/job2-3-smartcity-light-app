import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { JwtModule, } from '@auth0/angular-jwt';
import { IonicStorageModule } from '@ionic/storage';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage,} from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { VideoPage } from '../pages/video/video';

import { ModalPageModule } from '../pages/modal-page/modal-page.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServiceModule } from '../service/index';
import { httpInterceptorProviders } from '../interceptor/index';
export function jwtOptionsFactory(storage) {
  return {
    tokenGetter: () => {
      return storage.get('access_token');
    }
  }
}
export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    VideoPage,
    LoginPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    // HttpModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    }),
    // JwtModule.forRoot({
    //   jwtOptionsProvider: {
    //     provide: JWT_OPTIONS,
    //     useFactory: jwtOptionsFactory,
    //     deps: [Storage]
    //   }
    // }),
    IonicModule.forRoot(MyApp),
    ServiceModule,
    ModalPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    LoginPage,
    TabsPage,
    VideoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    httpInterceptorProviders,
    // JwtHelperService
  ]
})
export class AppModule {}
