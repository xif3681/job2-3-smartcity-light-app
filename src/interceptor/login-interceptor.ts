import { Injectable,  } from '@angular/core';
// import { Router } from '@angular/router';
import { App, } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpErrorResponse,
    HttpSentEvent,
    HttpHeaderResponse,
    HttpProgressEvent,
    HttpResponse,
    HttpEvent,
    HttpUserEvent,
} from '@angular/common/http';

import { Observable, } from 'rxjs/Observable'; 
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';
import { mergeMap, } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';



@Injectable()
export class LoginInterceptor implements HttpInterceptor { //  implements HttpInterceptor

    constructor(private appCtrl: App, private storage: Storage  ) { }

    // private goTo(url: string): void {
    //     setTimeout(() => this.injector.get(Router).navigateByUrl(url));
    // }

    logout() {
        window.localStorage.removeItem('access_token');
        this.storage.remove('access_token');
        this.appCtrl.getRootNav().setRoot(LoginPage); //调用this.app.getRootNav() 从根页面跳转就可以了)

    }

    private handleData(event: HttpResponse<any> | HttpErrorResponse, ): Observable<any> {
        // 业务处理：一些通用操作
        const that = this;
        switch (event.status) {
            case 200:
                const jwt = event.headers.get('jwt');
                if (jwt) {
                    localStorage.setItem('access_token', jwt);
                    that.storage.set('access_token', jwt);
                }
                return of(event); // break;

            case 403: // 过期状态码
                // if (event['error'].message && event['error'].message.indexOf('expired') > 0) {
                //     that.logout();
                // }
                that.logout();
                return _throw(event); // break;
            default:
                return _throw(event); // break;
        }
        // return of(event);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<
        | HttpSentEvent
        | HttpHeaderResponse
        | HttpProgressEvent
        | HttpEvent<any>
        | HttpResponse<any>
        | HttpUserEvent<any>> {
        const url = req.url;
        const newReq = req.clone({
            url: url,
        });
        return next.handle(newReq).pipe(
            catchError((httpError: HttpErrorResponse) => {
                return this.handleData(httpError);
            }),
            mergeMap((event: any) => {
                // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
                if (event instanceof HttpResponse && event.status === 200) {
                    return this.handleData(event);
                }
                // 若一切都正常，则后续操作
                return of(event);
            })
        );
    }

}
