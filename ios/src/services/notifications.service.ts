import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SettingService } from './../common/setting.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class NotificationsService {

    constructor(private _http: Http, private _settingGlobal: SettingService) {

    }
    initListNotifications(dataPage:number){
    	return this._http.get(this._settingGlobal._api_notifications_getList+dataPage)//, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    updateViewNotifications(notifyId:number){
        return this._http.get(this._settingGlobal._api_notifications_updateView+notifyId)
            .map(this.extractData)
            .catch(this.handleError);
    }
    deleteViewNotifications(notifyId:number){
        return this._http.get(this._settingGlobal._api_notifications_deleteView+notifyId)
            .map(this.extractData)
            .catch(this.handleError);
    }
    countNewNotifications(){
        return this._http.get(this._settingGlobal._api_notifications_countNewNotify)
            .map(this.extractData)
            .catch(this.handleError);
    }
    sendNotification(data:any){
        let headers = new Headers();
        headers.append('Content-Type','application/json');
        headers.append('Authorization','key=AAAAZfyba8o:APA91bEPMRUsZeEYjSYCOkRQsbBdV8JsdY3lRatACM-1dPR2s_NU5M5pzD0ZVxCQkjKRnXlJJLVfvoFLHvTJqRSlbbH3w1nU1WdXRkgtBp5s8cXVDVsqSP-BbP42l3i-JLWf73jvKPdrq9W8ZTspcxRw_d7pEB1_Cg');
        let options = new RequestOptions({ headers : headers });
        return this._http.post(this._settingGlobal._api_fcm_notification,data,options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError = (error: any) => {
        if (error.status == 400 || error.status == 401 || error.status == 403) {
            // localStorage.clear();
        }
        else if (error.status == 406) {
            return Observable.of(JSON.parse(error._body));
        }
        return Observable.of([]);
    }
}