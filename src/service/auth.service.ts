import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/Observable/of';
import {  catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { ENV } from '@environment';


@Injectable()
export class AuthService {
    isLoggedIn = false;
    error: boolean;
    model: any;
    // url = 'http://172.18.1.133:10003/security';
    // url = '/security';
    url = ENV.security;

    // store the URL so we can redirect after logging in
    redirectUrl: string;

    public token: string;

    constructor(private http: HttpClient, private storage: Storage ) {

    }


    login(userName: String, password: String): Observable<any> {
        console.log('this.url')
        console.log(this.url)

        return this.http.post(`${this.url}/login`, { 'userName': userName, 'password': password }, { responseType: 'text' })
        // return this.http.post('/security/login', { 'userName': userName, 'password': password })
        .pipe(
            map((res) => {
                console.log(res);
                const token = res;
                if (token) {
                    this.isLoggedIn = true;
                    this.storage.set('access_token', token);
                    localStorage.setItem('access_token', token);
                    return token;
                }

            },
            catchError((err) => {
                console.log(err);
                return of(err);
            }
            )
        ));

    }

    getAuthorizationToken() {
        return localStorage.getItem('access_token');
        // return this.storage.get('access_token');


    }




}


/*

Copyright(c): 2018 深圳创新设计研究院
Author: luo.shuqi@live.com
@file: auth.service.ts
@time: 2018 / 7 / 2 17: 18

*/

