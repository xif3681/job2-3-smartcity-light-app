
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable()
export class VideoService {

    constructor(private http: HttpClient) {


    }
    // 获取指定坐标范围内的摄像头信息
    getCameras(ne: any, sw: any): Observable<any> {
        return this.http.post('/api/camera/inbounds', {
            'ne': ne,
            'sw': sw
        })
            .pipe(map((res) => {
                return res;
            }));
    }

}
