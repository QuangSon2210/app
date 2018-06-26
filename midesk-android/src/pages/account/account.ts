import { UserService } from './../../services/user.service';
import { DataService } from './../../common/data.service';
import { AuthService } from './../../services/authentication/auth.service';
import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { CookieService } from 'angular2-cookie/core';
import { MessageService } from '../../common/message.service';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  modelUser:any={};
  modelEdit:any={};
  modelUpdate:any={};
  colorAvatar:any;
  nameAvatar:any;
  password:any='';
  confirmPassword:any='';
  countEdit = 0;
  enableToggle:boolean=false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private _authService: AuthService,
    private _dataService: DataService,
    private _userService: UserService,
    private _cookieService: CookieService,
    private _event : Events,
    private _msgService: MessageService
  ) {
  }
  edit:boolean=false;
  ionViewDidLoad() {
    this.initProfileUser();
  }
  initProfileUser(){
    this.modelUser = this._authService.getLoggedInUser();
    this.nameAvatar = this._authService.getLoggedInUser().lastname.substr(0,1);
    this.colorAvatar = this.modelUser.datecreate.toString().substr(4,6);
    console.log(this.modelUser);
  }
  editAccount(){
    this.edit = true;
    this.modelEdit = Object.assign('',this.modelUser);
    this.modelUpdate = {};
  }
  closeEdit(){
    this.edit = false;
    this.modelEdit = {};
    this.modelUpdate = {};
    this.enableToggle = false;
    this.countEdit = Object.keys(this.modelUpdate).length;
  }
  submitEdit(){
    if(this.enableToggle){
      if(this.password==='' && this.confirmPassword===''){
        this._dataService.createAlertWithoutHandle(this._msgService._msg_account_empty_password);
      }
      else{
        if(this.password !== this.confirmPassword){
          this._dataService.createAlertWithoutHandle(this._msgService._msg_account_incorrect_password);
        }
        else{
          this.modelUpdate['password'] = this.password;
          let alert = this._dataService.createAlertWithHandle(this._msgService._msg_account_confirm_update);
          alert.present();
          alert.onDidDismiss((data)=>{
            if(data){
              this.updateProfileUser();
              this._dataService.createAlertWithoutHandle(this._msgService._msg_account_auto_logout);
              this._authService.logoutUser();
              setTimeout(()=>{
                window.location.reload();
              },500)
            }
          })
        }
      }
    }else{
      if(this.countEdit>0){
        let alert = this._dataService.createAlertWithHandle(this._msgService._msg_account_confirm_update);
          alert.present();
          alert.onDidDismiss((data)=>{
            if(data) this.updateProfileUser();
          })
      }
    }
  }
  onInsertData($event,$type){
    if($event.target.value != this.modelEdit[$type]){
      this.modelUpdate[$type] = $event.target.value;
    }
    else if($event.target.value == this.modelEdit[$type]){
      delete this.modelUpdate[$type];
    }
    this.countEdit = Object.keys(this.modelUpdate).length;
  }
  updateProfileUser(){
    this._userService.updateUserProfile({data:this.modelUpdate}).subscribe(res=>{
      if(res.code==200){
        this._cookieService.remove('curuser');
        this._cookieService.putObject('curuser',{info:res.data});
        this.edit =!this.edit;
        this.initProfileUser();
        this._event.publish('UPDATE PROFILE');
      }
      
    })
  }

  changePassword(){
    if(this.enableToggle){
      this._dataService.createAlertWithoutHandle(this._msgService._msg_account_change_password);
    }else{
      this.password ='';
      this.confirmPassword = '';
    }
  }
}
