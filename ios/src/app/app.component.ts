import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TicketAddPage } from '../pages/ticket/ticket-add/ticket-add';
import { TicketDetailPage } from '../pages/ticket/ticket-detail/ticket-detail';
import { DataService } from '../common/data.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/authentication/auth.service';
import { MessageService } from '../common/message.service';
import { SocketService } from '../common/socket.service';
import { NotificationsService } from '../services/notifications.service';
import { SettingPage } from '../pages/setting/setting';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FCM } from '@ionic-native/fcm';
import { NotificationsPage } from '../pages/notifications/notifications';
import { AccountPage } from '../pages/account/account';
import { ContactPage } from '../pages/contact/contact';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any, icon: string}>;

  loggedInUser = {};
  logged = false;
  countNotify:any;
  token:any;
  vibrate:any;
  avatarName:string;
  room:any={};
  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private _dataService: DataService,
    private _userService: UserService,
    private _authService: AuthService,
    private _msgService: MessageService,
    private _socketService: SocketService,
    private _notifyService: NotificationsService,
    private _localNotification: LocalNotifications,
    private _fcm: FCM,
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Thông Báo', component: NotificationsPage, icon:'notifications-outline'},
      { title: 'Tạo Phiếu Mới', component: TicketAddPage, icon:'create'},
      { title: 'Liên Hệ', component: ContactPage, icon:'people'},
      { title: 'Tài Khoản', component: AccountPage, icon:'contact'},
      { title: 'Cài Đặt', component: SettingPage, icon:'settings'},

    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.checkLogin();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  checkLogin(){
    if(this._authService.isUserLoggedIn()){
      this.connectSocket();
      this.initFCMToken();
      this.listenEventNewNotifi();
      this.listenEventUpdate();
      this.handleNotification();
      this.receiveNotification();
      this.checkTokenExpired();
      this._notifyService.countNewNotifications().subscribe(res => { this.countNotify = res;});
      this.loggedInUser = this._authService.getLoggedInUser();
      this.avatarName = this._authService.getLoggedInUser().lastname;
      this.avatarName = this.avatarName.substr(0,1);
      this.rootPage = HomePage;
    }else{
      this.loggedInUser = {};
      this.rootPage = LoginPage;
    }
  }
  checkTokenExpired(){
    this._userService.checkToken(this._authService.getToken()).subscribe(res=>{
      if(res.code == 401){
        let alert = this._dataService.createAlertWithHandle('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        alert.present();
        alert.onDidDismiss(data=>{
          this._userService.logout(this._authService.getUserLastlogId()).subscribe(res=>{
            this._fcm.unsubscribeFromTopic(this._authService.getLoggedInUser().id.toString());
            this._socketService.disconnect();
            this._authService.logoutUser();
            window.location.reload();
          })
        })
      }
    });
  }
  initFCMToken(){
    this.token = localStorage.getItem('fcm_token');
    this._userService.updateFCMToken({data:{fcm_token:this.token}}).subscribe();
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }
  connectSocket(){
    this.room=JSON.parse(this._authService.getLoggedInRoom());
    let self = this;
    setTimeout(function(){
      self._socketService.connect(self.room);
    },2000);
    this._socketService.listenEvent('disconnect').subscribe(()=>{
      window.setTimeout(this.connectSocket(),5000);
    })
  }
  logOut(){
    let promt = this._dataService.createAlertWithHandle(this._msgService._msg_user_logout);
    promt.present();
    promt.onDidDismiss(data=>{
      if(data){
        let loading = this._dataService.createLoading();
        loading.present();
        this._userService.logout(this._authService.getUserLastlogId()).subscribe(res=>{
          if(res.code==200){
            this._fcm.unsubscribeFromTopic(this._authService.getLoggedInUser().id.toString());
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
      //if(userId == data[0]['id_user'] || team.indexOf(data[0]['id_team'],0)!=-1 && data[0]['del_agent'] != userId && data[0]['view'] != userId){
      if(userId == data[0]['id_user'] && data[0]['del_agent'] != userId && data[0]['view'] != userId){      
        this.countNotify+=1;
        let custom = JSON.parse(data[0]['custom']);
        if(this._authService.enableNotify()){
          this._localNotification.schedule({
            id:1,
            title: data[0]['title'].replace(/(<([^>]+)>)/ig,""),
            text: data[0]['content'],
            data:{
              id: custom.id,
              ticket_id: custom.id,
              notify_id: data[0]['id'],
              user_id: data[0]['del_agent']
            }
          })
        }
      }
    });
  }
  initLocalNotification(data){
    this._localNotification.schedule({
      id:2,
      title: data.title,
      text: data.content,
      vibrate:this.vibrate,
      launch:true,
      progressBar: true,
      data:{
        id:data.id,
        ticket_id:data.ticket_id,
        notify_id:data.notify_id,
        user_id: data.user_id
      }
    })
  }
  receiveNotification(){
    let user_id = this._authService.getLoggedInUser().id.toString();
    this._fcm.subscribeToTopic(user_id);
    this._fcm.onNotification().subscribe(res=>{
      let index = { id: res.ticket_id};
      if(res.wasTapped){
        if(!(this.nav.getActive().instance instanceof TicketDetailPage)){
          this.nav.push(TicketDetailPage,{data:index,component:'TicketDetailPage'});
        }
      }
    });
  }
  handleNotification(){
    this._localNotification.on('click').subscribe(res=>{
      let index = { id: res.data.ticket_id }; 
      if(!(this.nav.getActive().instance instanceof TicketDetailPage)){
        this.nav.push(TicketDetailPage,{data:index,component:'TicketDetailPage'});
      }
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
