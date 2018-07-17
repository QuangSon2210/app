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
    private _fcm: FCM
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
      if(this._authService.isUserLoggedIn()){
        this.connectSocket();
        this.initFCMToken();
        this.listenEventNewNotifi();
        this.listenEventUpdate();
        //this.handleNotification();
        this.receiveNotification();
        this._notifyService.countNewNotifications().subscribe(res => { this.countNotify = res;});
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
  disconnect(){
    this._socketService.disconnect();
  }
  initFCMToken(){
    // if(localStorage.getItem('fcm_token') =='' || typeof localStorage.getItem('fcm_token') == 'undefined' || localStorage.getItem('fcm_token') == null){
    //   this._fcm.getToken().then(token=>{
    //     localStorage.setItem('fcm_token',token);
    //     this.token = token;
        
    //   })
    // }
    // else {
    //   this.token = localStorage.getItem('fcm_token');
    // }
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
    // this._socketService.listenEvent('connect').subscribe(()=>{
    //   this.initFCMToken();
    //   this.listenEventNewNotifi();
    //   this.listenEventUpdate();
    //   this.handleNotification();
    //   this.receiveNotification();
    // })
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
        //this.token = this._authService.getFCMToken();
        //this.token = localStorage.getItem('fcm_token');
        if(this._authService.enableNotify()){
          this.pushNotifications(data);
          this.vibrate = this._authService.enableVibrate();
        }
      }
    });
  }
  pushNotifications(data){
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
      notify_id: data[0]['id'],
      user_id: data[0]['del_agent']
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
      //"to":'/topics/all',
      "priority":"high",
      //"restricted_package_name":""
    }
    //alert(JSON.stringify(body));
    console.log(body);
    this._notifyService.sendNotification(body).subscribe();
  }
  initLocalNotification(data){
    this._localNotification.schedule({
      id:1,
      title: data.title,
      text: data.content,
      vibrate:this.vibrate,
      data:{
        id:data.id,
        ticket_id:data.ticket_id,
        notify_id:data.notify_id,
        user_id: data.user_id
      }
    })
  }
  receiveNotification(){
    //alert(localStorage.getItem('fcm_token'));
    // this._fcm.subscribeToTopic('new').then(data=>{
    //   alert(JSON.stringify(data));
    // })
    this._fcm.subscribeToTopic("test")
    this._fcm.onNotification().subscribe(res=>{
      // if(this._authService.getLoggedInUser().id != res.user_id){
      //     this.initLocalNotification(res);
      // }
      if(res.wasTapped){
        alert(JSON.stringify(res));
      }else{
        this.initLocalNotification(res);
      }
      // alert(JSON.stringify(res));
      // if(res.wasTapped){
      //   this.initLocalNotification(res);
      // }else this.initLocalNotification(res);
    })
    this._fcm.unsubscribeFromTopic("test");
  }
  handleNotification(){
    this._localNotification.on('click').subscribe(res=>{
      let index = { id: res.data.id };
      this.nav.push(TicketDetailPage,{data:index,component:'TicketDetailPage'});
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
