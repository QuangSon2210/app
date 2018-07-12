import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
//import { CookieService } from 'angular2-cookie/core';
import { User } from './../../models/user';
import { FCM } from '@ionic-native/fcm';
import { Platform } from 'ionic-angular';

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
            this._fcm.getToken().then(token=>{
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
            localStorage.setItem(TOKEN_NAME,this.loggedInUser.token);
            localStorage.setItem('curuser',JSON.stringify({ info: this.loggedInUser.user, user_log: this.loggedInUser.user_log }));
            localStorage.setItem('room',this.loggedInUser.room);
            localStorage.setItem('data',JSON.stringify({ priority: this.loggedInUser.priority, relation: this.loggedInUser.relation }));
            localStorage.setItem('fcm_token', this.fcm_token);
            localStorage.setItem('setting',JSON.stringify({ notify:this.loggedInUser.user.is_notification,vibrate:'1'}));
        } else {
            console.log('Empty token ---');
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
        if(localStorage.getItem('curuser')){
            this.loggedInUser = JSON.parse(localStorage.getItem('curuser'))['info'];
        }
        return this.loggedInUser;
    }
    getLoggedInRoom(){
        if(localStorage.getItem('room')){
            this.loggedInUser = localStorage.getItem('room');
        }
        return this.loggedInUser;
    }
    getFCMToken():string{
        if(localStorage.getItem('fcm_token') =='' || typeof localStorage.getItem('fcm_token') =='undefined' || localStorage.getItem('fcm_token') ==null){
            this.initFCMToken();
            localStorage.setItem('fcm_token', this.fcm_token);
            return this.fcm_token;
        }
        return localStorage.getItem('fcm_token');
    }
    enableNotify():boolean{
        let flag = JSON.parse(localStorage.getItem('setting'))['notify'];
        if(flag=='1'){
            return true;
        }else {
            return false;
        }
    }
    enableVibrate():boolean{
        let flag = JSON.parse(localStorage.getItem('setting'))['vibrate'];
        if(flag=='1'){
            return true;
        }else {
            return false;
        }
    }
    getUserLastlogId() {
        if(localStorage.getItem('curuser')){
            return JSON.parse(localStorage.getItem('curuser'))['user_log'].id;
        }
        return 0;
    }
    getPriority(){
        if(localStorage.getItem('data')){
            this.loggedInUser = JSON.parse(localStorage.getItem('data'))['priority'];
        }
        return this.loggedInUser;
    }
    getRelation(){
        if(localStorage.getItem('data')){
            this.loggedInUser = JSON.parse(localStorage.getItem('data'))['relation'];
        }
    }
    logoutUser(): void {
        localStorage.clear();
        this.isloggedIn = false;
    }
} 