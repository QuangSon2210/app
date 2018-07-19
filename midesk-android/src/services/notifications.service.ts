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
        headers.append('Authorization','key=AAAAZfyba8o:APA91bFmA8AcSxVwydKqQ1ftAqBWVaW4KpIYCB1lUZqzDlH83AOOg32cedNX77mcHKZ99FKm5zENCoveqvt98kl6rEH7O1bBZiOVU2OB84YS81rVIwsVXMJVRn_T0TpibMltVtCZ0wIyS8QNgGfXjv_irCMihUvzLA');
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