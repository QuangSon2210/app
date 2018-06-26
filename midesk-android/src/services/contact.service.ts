import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
//import { AuthService } from './authentication/auth.service';
//import { User } from './../models/user';
import { SettingService } from './../common/setting.service';

@Injectable()
export class ContactService {
	constructor(private _http: Http, private _settingGlobal: SettingService) {

    }
    getListContact(dataPage:number){
    	return this._http.get(this._settingGlobal._api_contact_getList+dataPage)
    		.map(this.extractData)
    		.catch(this.handleError);
    }
    getContactProfile(contactId:number){
        return this._http.get(this._settingGlobal._api_contact_profile+contactId)
            .map(this.extractData)
            .catch(this.handleError);
    }
    updateContact(data:any){
        return this._http.put(this._settingGlobal._api_contact_update,data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    addContact(data:any){
        return this._http.post(this._settingGlobal._api_contact_add,data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    searchContact(data:any={}){
        return this._http.post(this._settingGlobal._api_contact_search,data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getCustomer(contactId:number){
        return this._http.get(this._settingGlobal._api_customer_getList+contactId)
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