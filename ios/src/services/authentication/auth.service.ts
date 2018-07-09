import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
//import { CookieService } from 'angular2-cookie/core';
import { User } from './../../models/user';
import { FCM } from '@ionic-native/fcm';
import { Platform } from 'ionic-angular/umd';

export const TOKEN_NAME: string = 'jwt_token';

@Injectable()
export class AuthService {
    fcm_token:string;
    private isloggedIn: boolean = false;
    private loggedInUser: any; //User
    constructor(
        //public _cookieService: CookieService,
        private _fcm: FCM,
        private _platform: Platform
    ){
        this.initFCMToken();
    }
    initFCMToken(){
        this._platform.ready().then(()=>{
            this._fcm.getToken().then((token)=>{
                this.fcm_token = token;
            })
        })
        
    }
    getToken(): string {
        //return this._cookieService.get(TOKEN_NAME);
        return localStorage.getItem(TOKEN_NAME);
    }
    setUserAuthenticated(userLogin): boolean {
        if (typeof userLogin.success != 'undefined' && userLogin.success.token != '') {
            this.isloggedIn = true;
            this.loggedInUser = userLogin.success;
            //this._localStorage.setItem('TOKEN',this.loggedInUser.token).subscribe();
            localStorage.setItem(TOKEN_NAME,this.loggedInUser.token);
            localStorage.setItem('curuser',JSON.stringify({ info: this.loggedInUser.user, user_log: this.loggedInUser.user_log }));
            localStorage.setItem('room',this.loggedInUser.room);
            localStorage.setItem('data',JSON.stringify({ priority: this.loggedInUser.priority, relation: this.loggedInUser.relation }));
            localStorage.setItem('fcm_token', this.fcm_token);
            localStorage.setItem('setting',JSON.stringify({ notify:this.loggedInUser.user.is_notification,vibrate:'1'}));
            // this._cookieService.put('fcm_token',this.fcm_token);
            // this._cookieService.putObject('curuser', { info: this.loggedInUser.user, user_log: this.loggedInUser.user_log });
            // this._cookieService.putObject('priority',{ priority: this.loggedInUser.priority, relation: this.loggedInUser.relation });
            // this._cookieService.putObject('room',{room: this.loggedInUser.room});
            // this._cookieService.put(TOKEN_NAME, this.loggedInUser.token);
            // this._cookieService.putObject('setting',{ notify:this.loggedInUser.user.is_notification,vibrate:'1'});
        } else {
            console.log('Empty token ---');
            //this._cookieService.removeAll();
            localStorage.clear();
            this.isloggedIn = false;
        }
        return this.isloggedIn;
    }

    isUserLoggedIn(): boolean {
        if (this.getToken()) {
            this.isloggedIn = true;
        }
        return this.isloggedIn;
    }
    getLoggedInUser(): User {
        // if (this._cookieService.getObject('curuser')) {
        //     this.loggedInUser = this._cookieService.getObject('curuser')['info'];
        // }
        // return this.loggedInUser;
        if(localStorage.getItem('curuser')){
            this.loggedInUser = JSON.parse(localStorage.getItem('curuser'))['info'];
        }
        return this.loggedInUser;
    }
    getLoggedInRoom(){
        // if (this._cookieService.getObject('room')) {
        //     this.loggedInUser = this._cookieService.getObject('room')['room'];
        // }
        // return this.loggedInUser;
        if(localStorage.getItem('room')){
            this.loggedInUser = localStorage.getItem('room');
        }
        return this.loggedInUser;
    }
    getFCMToken():string{
        return localStorage.getItem('fcm_token');
        //return this._cookieService.get('fcm_token');
    }
    enableNotify():boolean{
        //let flag = this._cookieService.getObject('setting')['notify'];
        let flag = JSON.parse(localStorage.getItem('setting'))['notify'];
        if(flag=='1'){
            return true;
        }else {
            return false;
        }
    }
    enableVibrate():boolean{
        //let flag = this._cookieService.getObject('setting')['vibrate'];
        let flag = JSON.parse(localStorage.getItem('setting'))['vibrate'];
        if(flag=='1'){
            return true;
        }else {
            return false;
        }
    }
    getUserLastlogId() {
        // if (this._cookieService.getObject('curuser')) {
        //     return this._cookieService.getObject('curuser')['user_log'].id;
        // }
        // return 0;
        if(localStorage.getItem('curuser')){
            return JSON.parse(localStorage.getItem('curuser'))['user_log'].id;
        }
        return 0;
    }
    getPriority(){
        // if (this._cookieService.getObject('priority')) {
        //     this.loggedInUser = this._cookieService.getObject('priority')['priority'];
        // }
        // return this.loggedInUser;
        if(localStorage.getItem('data')){
            this.loggedInUser = JSON.parse(localStorage.getItem('data'))['priority'];
        }
        return this.loggedInUser;
    }
    getRelation(){
        // if (this._cookieService.getObject('priority')) {
        //     this.loggedInUser = this._cookieService.getObject('priority')['relation'];
        // }
        // return this.loggedInUser;
        if(localStorage.getItem('data')){
            this.loggedInUser = JSON.parse(localStorage.getItem('data'))['relation'];
        }
    }
    logoutUser(): void {
        //this._cookieService.removeAll();
        localStorage.clear();
        this.isloggedIn = false;
    }
} 