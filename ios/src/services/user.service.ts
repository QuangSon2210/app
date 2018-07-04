import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
//import { AuthService } from './authentication/auth.service';
//import { User } from './../models/user';
import { SettingService } from './../common/setting.service';

@Injectable()
export class UserService {

    constructor(private _http: Http, private _settingGlobal: SettingService) {

    }

    checkUserLogin(email: string, password: string): Observable<any> {
        // console.log(this._settingGlobal._api_auth_login);
        return this._http.post(this._settingGlobal._api_auth_login, JSON.stringify({ email: email, password: password }))//, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    logout(id: any) {
        return this._http.post(this._settingGlobal._api_auth_logout, { id: id })
            .map(this.extractData)
            .catch(this.handleError);
    }
    getListUserTeam(){
        return this._http.get(this._settingGlobal._api_user_getListUserTeam)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getListRequester(data: any={}){
        return this._http.post(this._settingGlobal._api_requester_getList,data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getMoreRequester(pageNumber:number){
        return this._http.get(this._settingGlobal._api_requester_getList+'?page='+ pageNumber)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getListTeam(){
        return this._http.get(this._settingGlobal._api_user_getListTeam)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getUserInTeam(teamId:number){
        return this._http.get(this._settingGlobal._api_user_getUserInTeam + teamId)
            .map(this.extractData)
            .catch(this.handleError);
    }
    searchRequester(data: any={}){
        return this._http.post(this._settingGlobal._api_requester_search,data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    searchAssigner(data: any={}){
        return this._http.post(this._settingGlobal._api_assigner_search,data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    updateUserProfile(data:any={}){
        return this._http.put(this._settingGlobal._api_user_update_profile,data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    updateFCMToken(data:any={}){
        return this._http.put(this._settingGlobal._api_user_update_fcm_token,data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    updateNotify(status:any){
        return this._http.put(this._settingGlobal._api_user_update_notify,status)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getUserName(userId:number){
        return this._http.get(this._settingGlobal._api_user_get_name+userId)
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