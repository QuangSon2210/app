import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SettingService } from './../common/setting.service';
//import { Case } from './../models/case';

//Import RxJs required methods
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
        headers.append('Authorization','key=AAAAeKKOKTg:APA91bHFGTSoqU_7xSyijJRFJx6uMrbomdsmNtcg4-_WMJJF5YK5A-T2JLFX8JFT6QhKz4gTuboC6CDjt40aDPTxRlIoF3i20eZPO2Gf-5B3ug1Y9fC93vE0Kc8rsALp3gDF_8gkrbSI');
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