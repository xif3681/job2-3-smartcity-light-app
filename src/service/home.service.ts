
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/';

import { HttpClient } from '@angular/common/http';
import { ENV } from '@environment';
// import { HttpErrorResponse } from '@angular/common/http';
// import { ErrorObservable } from 'rxjs/observable/ErrorObservable';



import { map } from 'rxjs/operators';


@Injectable()
export class HomeService {
    // url = 'http://172.18.1.133:10002/api';
    // url = '/api';
    url = ENV.api;

    constructor(private http: HttpClient) {


    }

    // private handleError(error: HttpErrorResponse) {
    //     if (error.error instanceof ErrorEvent) {
    //         // A client-side or network error occurred. Handle it accordingly.
    //         console.error('An error occurred:', error.error.message);
    //     } else {
    //         // The backend returned an unsuccessful response code.
    //         // The response body may contain clues as to what went wrong,
    //         console.error(
    //             `Backend returned code ${error.status}, ` +
    //             `body was: ${error.error}`);
    //     }
    //     // return an ErrorObservable with a user-facing error message
    //     return new ErrorObservable(
    //         'Something bad happened; please try again later.');
    // };

    // 城市列表
    getZoneDefault(): Observable<any> {
        return this.http.get(`${this.url}/zone/default`)
            .pipe(map((res: Response) => {
                return res;
            }));
    }


    // 获取详细的位置数据
    getLights(ne: any, sw: any): Observable<any> {
        return this.http.post(`${this.url}/streetlight/inbounds`, {
            'ne': ne,
            'sw': sw
        })
            .pipe(map((res: Response) => {
                return res;
            }));
    }

    // 临时控制路灯
    setLightsContr(id, level, stopTime): Observable<any> {
        return this.http.put(`${this.url}/streetlight/level`, {
            'id': id,
            'level': level,
            'stopTime': stopTime
        })
            .pipe(map((res: Response) => {
                const data = { status: 200 };
                return data;
            }));
    }

    // 修改路灯控制策略
    setStrategyRule(id, ruleId): Observable<any> {
        return this.http.put(`${this.url}/streetlight/setrule`, {
            'id': id,
            'ruleId': ruleId
        })
            .pipe(map((res: Response) => {
                const data = { status: 200 };
                return data;
            }));
    }

    // 获取策略表
    getStrategy(): Observable<any> {
        return this.http.get(`${this.url}/streetlight/rule`)
            .pipe(map((res: Response) => {
                return res;
            }));
    }

    // 设置多个指定路灯亮度
    setLightsLevel(ids, level, stopTime): Observable<any> {
        return this.http.put(`${this.url}/streetlight/levels`, {
            'ids': ids,
            'level': level,
            'stopTime': stopTime
        })
            .pipe(map((res: Response) => {
                const data = { status: 200 };
                return data;
            }));
    }

    // 设置多个指定路灯策略并下发
    setLightsRule(ids, ruleId): Observable<any> {
        return this.http.put(`${this.url}/streetlight/setrules`, {
            'ids': ids,
            'ruleId': ruleId
        })
            .pipe(map((res: Response) => {
                const data = { status: 200 };
                return data;
                // if (res.status === 200) {
                //     const data = { status: 200 };
                //     // console.log(res.json());
                //     return data;
                // } else if (res.status === 202) {
                //     return res.json().code.toString();
                // }
            }));
    }

    // 获取策略表
    getLightByDeviceName(lightName: String): Observable<any> {
        return this.http.get(`${this.url}/streetlight?lightName=${lightName}`)
            .pipe(map((res: Response) => {
                return res;
            }));
    }


}
