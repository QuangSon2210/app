import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SettingService } from './../common/setting.service';
import { AuthService } from './authentication/auth.service';
//import { Case } from './../models/case';

//Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class TicketService {
    constructor(private _http: Http, private _settingGlobal: SettingService, private _authService: AuthService) {
    }
    getListTicket(data: any={}){
        return this._http.post(this._settingGlobal._api_ticket_getList,data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getMoreTicket(data:any={}){
        return this._http.post(this._settingGlobal._api_ticket_getList+'?page='+data.page,data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getTicketDetail(data: any={}){
        return this._http.get(this._settingGlobal._api_ticket_getDetail + data.id)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getPriority(data: any={}){
        return this._http.get(this._settingGlobal._api_priority_getList)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getTagsByGroup(data: any={}){
        return this._http.get(this._settingGlobal._api_tags_getList)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getTicketCategory(cateId:number){
        return this._http.get(this._settingGlobal._api_category_getList + cateId)
            .map(this.extractData)
            .catch(this.handleError);
    }
    searchTicket(data:any={}){
        return this._http.post(this._settingGlobal._api_search_ticket,data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getCategoryName(cateId:any){
        return this._http.get(this._settingGlobal._api_get_category_name+cateId)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getMoreSearch(data:any={}){
        return this._http.post(this._settingGlobal._api_search_ticket+'?page='+data.page,data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    createTicket(data:any){
        let headers = new Headers();
        headers.append('Authorization', 'Bearer '+ this._authService.getToken());
        headers.delete('Content-Type');
        let options = new RequestOptions({ headers: headers });
        return this._http.post(this._settingGlobal._api_create_ticket, data, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    actionTicket(data:any){
        let headers = new Headers();
        headers.append('Authorization', 'Bearer '+ this._authService.getToken());
        headers.delete('Content-Type');
        let options = new RequestOptions({ headers : headers });
        return this._http.post(this._settingGlobal._api_action_ticket, data, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getTicketByContact(contactId:number){
        return this._http.get(this._settingGlobal._api_ticket_contact + contactId)
            .map(this.extractData)
            .catch(this.handleError);
    }
    trashOrResolveTicket(ticketId:number){
        return this._http.put(this._settingGlobal._api_trash_or_resolve_ticket,{ticketId:ticketId})
            .map(this.extractData)
            .catch(this.handleError);
    }
    deleteTicket(ticketId:number){
        return this._http.delete(this._settingGlobal._api_delete_ticket+ticketId)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getMacro(){
        return this._http.get(this._settingGlobal._api_get_macro)
            .map(this.extractData)
            .catch(this.handleError);
    }
    // pushNotifications(data:any){
    //     let headers = new Headers();
    //     headers.append('Content-Type','application/json');
    //     headers.append('Authorization','key=AAAAeKKOKTg:APA91bHa9BgAUJKKI_72iAsyzy8iVXRceq2JWg_u6QOcxSgSpB9gm32lx7qcdX2c2WNPXcxYQceAh-iDnvJwHoNu0vOtCgKoqV6rG72hBTdfpNRTbcVbOEAePHPGsmzoc8ZRLhYSQFvF');
    //     //headers.append('Authorization','key='+deviceToken);
    //     let options = new RequestOptions({ headers : headers });
    //     return this._http.post(this._settingGlobal._api_notification,data,options)
    //         .map(this.extractData)
    //         .catch(this.handleError);
    // }
    countTicket(){
        return this._http.get(this._settingGlobal._api_count_ticket)
            .map(this.extractData)
            .catch(this.handleError);
    }
    private handleError = (error: any) => {
        return Observable.of([]);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}