import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/authentication/auth.service';
import { CookieService } from 'angular2-cookie/core';
import { DataService } from '../../common/data.service';
import { MessageService } from '../../common/message.service';
import { UserService } from '../../services/user.service';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  enableNotify:boolean;
  enableVibrate:boolean;
  data:any={};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _authService: AuthService,
    private _cookieService: CookieService,
    private _dataService: DataService,
    private _msgService: MessageService,
    private _userService: UserService
  ) {
    this.enableNotify = this._authService.enableNotify();
    this.enableVibrate = this._authService.enableVibrate();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }
  changeStatusNotify(){
    this.data['is_notification'] = (this.enableNotify==true)?'1':'0';
    let arr = this._cookieService.getObject('setting');
    arr['notify']= this.data['is_notification'];
    this._cookieService.putObject('setting',arr);
    this._userService.updateUserProfile({data:this.data}).subscribe(res=>{
      console.log(res);
    })
    if(arr['notify']=='0'){
      this._dataService.createAlertWithoutHandle(this._msgService._msg_setting_disable_notification);
    }
  }
  changeVibrate(){
    let flag = (this.enableVibrate==true)?'1':'0';
    let arr = this._cookieService.getObject('setting');
    arr['vibrate']= flag;
    this._cookieService.putObject('setting',arr);
  }
}
