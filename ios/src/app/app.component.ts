import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { DataService } from '../common/data.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/authentication/auth.service';
import { MessageService } from '../common/message.service';
import { SocketService } from '../common/socket.service';
import { NotificationsService } from '../services/notifications.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

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
    private _notifyService: NotificationsService
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, icon:'notifications-outline' },
      { title: 'Login', component: LoginPage, icon:'create'}
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
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  connectSocket(){
    this.room=JSON.parse(this._authService.getLoggedInRoom());
    let self = this;
    setTimeout(function(){
      self._socketService.connect(self.room);
    },2000);
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
}
