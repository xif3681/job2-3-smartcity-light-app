
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/';

import { HttpClient } from '@angular/common/http';
import { ENV } from '@environment';



import { map } from 'rxjs/operators';


@Injectable()
export class ContactService {
    // url = 'http://172.18.1.133:10002/api';
    // url = '/api';
    url = ENV.api;

    constructor(private http: HttpClient) {


    }
    

    // 获取用户处理事件
    getAllIssuesByUser(userId: String, state: number, isClosed: boolean): Observable<any> {
        return this.http.get(`${this.url}/issue/${userId}?state=${state}&isClosed=${isClosed}`)
            .pipe(map((res: Response) => {
                return res;
            }));
    }

    //
    setOneStateByUser(issueId: number, state: number, comment: String, orgState: number,
        assigneeId: String): Observable<any> {
        return this.http.post(`${this.url}/issue/one/${issueId}`, {
            'state': state,
            'comment': comment,
            'orgState': orgState,
            'assigneeId': assigneeId
        })
            .pipe(map((res: Response) => {
                return res;
            }));
    }
}
