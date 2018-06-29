import { AccountPage } from './../pages/account/account';
import { SocketService } from './../common/socket.service';
import { NotificationsService } from './../services/notifications.service';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FCM } from '@ionic-native/fcm';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from './../pages/home/home';
import { SettingPage } from './../pages/setting/setting';
import { ContactPage } from './../pages/contact/contact';
import { NotificationsPage } from './../pages/notifications/notifications';
import { LoginPage } from './../pages/login/login';
import { TicketAddPage } from './../pages/ticket/ticket-add/ticket-add';
import { AuthService } from '../services/authentication/auth.service';
import { DataService } from '../common/data.service';
import { MessageService } from '../common/message.service';
import { UserService } from '../services/user.service';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;
  loggedInUser = {};
  logged = false;
  pages: Array<{title: string, component: any, icon: string, badge:any}>;
  countNotify:any;
  token:any;
  vibrate:any;
  avatarName:string;
  room:any={};
  statusConnect:any;
  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen, 
    private _authService: AuthService,
    private _dataService: DataService,
    private _msgService: MessageService,
    private _notifyService:NotificationsService,
    private _fcm: FCM,
    private _localNotification: LocalNotifications,
    private _socketService: SocketService,
    private _userService: UserService
    ) {
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Thông Báo', component: NotificationsPage, icon:'notifications-outline', badge:'33'},
      { title: 'Tạo Phiếu Mới', component: TicketAddPage, icon:'create', badge:''},
      { title: 'Liên Hệ', component: ContactPage, icon:'people', badge:''},
      { title: 'Tài Khoản', component: AccountPage, icon:'contact', badge:''},
      { title: 'Cài Đặt', component: SettingPage, icon:'settings', badge:''},
    ];

  }
  ngOnInit(){
    
  }
  initializeApp() {
    this.platform.ready().then(() => {
      if(this._authService.isUserLoggedIn()){
        this.connectSocket();
        this.listenEventNewNotifi();
        this.listenEventUpdate();
        this.handleNotification();
        this.receiveNotification();
        this._notifyService.countNewNotifications().subscribe(res=>{ this.countNotify = res;});
        this.loggedInUser = this._authService.getLoggedInUser();
        this.avatarName = this._authService.getLoggedInUser().lastname;
        this.avatarName = this.avatarName.substr(0,1); 
        this.rootPage = HomePage;
      }else{
        this.loggedInUser = {};
        this.rootPage = LoginPage;
      } 
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  connectSocket(){
    this.room=JSON.parse(this._authService.getLoggedInRoom());
    let self = this;
    setTimeout(function(){
      self._socketService.connect(self.room);
    },2000);
    this.statusConnect = true;
  }
  openPage(page) {
    this.nav.push(page.component);
  }
  logOut(){
    this.confirmLogout();
  }
  confirmLogout(){
    let promt = this._dataService.createAlertWithHandle(this._msgService._msg_user_logout);
    promt.present();
    promt.onDidDismiss(data=>{
      if(data){
        let loading = this._dataService.createLoading();
        loading.present();
        this._userService.logout(this._authService.getUserLastlogId()).subscribe(res=>{
          if(res.code==200){
            this._socketService.disconnect();
            this._authService.logoutUser();
            window.location.reload();
          }
          else{
            this._dataService.createAlertWithHandle(res.message);
            loading.dismiss();
          }
        }) 
      }
    })
  }
  listenEventNewNotifi(){
    this._socketService.listenEvent('NEW NOTIFI').subscribe(data=>{
      let userId = this._authService.getLoggedInUser().id;
      let team = JSON.parse(this._authService.getLoggedInRoom()).array_team;
      team = team.split(',');
      if(userId == data[0]['id_user'] || team.indexOf(data[0]['id_team'],0)!=-1 && data[0]['del_agent'] != userId && data[0]['view'] != userId){
        this.countNotify+=1;
        this.token = this._authService.getFCMToken();
        if(this._authService.enableNotify()){
          this.pushNotifications(data);
          this.vibrate = this._authService.enableVibrate();
        }
      }
    });
  }
  pushNotifications(data){
    console.log(data);
      let title = data[0]['title'];
      var regex = /(<([^>]+)>)/ig;
      let custom = JSON.parse(data[0]['custom']);
      title = title.replace(regex, "");
      let content = data[0]['content'];
      let array = {
        content: content,
        title: title,
        id:custom.id,
        ticket_id: custom.ticket_id,
        notify_id: data[0]['id']
      }
      let body={
        "notification":{
          "title":title,
          "body":content,
          "sound":"default",
          "click_action":"FCM_PLUGIN_ACTIVITY",
          "icon":"fcm_push_icon",
          "forceStart": "1"
        },
        "data":array,
        "to":this.token,
        "priority":"high",
        "restricted_package_name":""
      }
      this._notifyService.sendNotification(body).subscribe(); 
  }
  initLocalNotification(data){
    this._localNotification.schedule({
      id:2,
      title: data.title,
      text: data.content,
      led:'66CC00',
      vibrate:this.vibrate,
      data:{
        id:data.id,
        ticket_id:data.ticket_id,
        notify_id:data.notify_id
      }
    })
  }
  receiveNotification(){
    //if(this._authService.enableNotify()){
      this._fcm.onNotification().subscribe(res=>{
        this.initLocalNotification(res);
      })
    //}
  }
  handleNotification(){
    this._localNotification.on('click').subscribe(res=>{
      alert(res.data.ticket_id);
    })
  }
  listenEventUpdate(){
    this._dataService.listenEvent('UPDATE PROFILE').subscribe(res=>{
      this.loggedInUser = this._authService.getLoggedInUser();
      this.avatarName = this._authService.getLoggedInUser().lastname;
      this.avatarName = this.avatarName.substr(0,1);
    })
    this._dataService.listenEvent('UPDATE NOTIFI').subscribe(res=>{
      this.countNotify-=1;
    })
  }
}