import { Component  } from '@angular/core';
import { MenuController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from './../../services/authentication/auth.service';
import { UserService } from './../../services/user.service';
import { DataService } from '../../common/data.service';
import { MessageService } from '../../common/message.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [UserService]
})
export class LoginPage {
	private loginForm : FormGroup;
 	invalidCredentialMsg: string = "";
  submitLoading: boolean = false;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private _authService: AuthService,
    private _userService: UserService,
    private menuCtrl: MenuController,
    private _dataService: DataService,
    private _msgService: MessageService
  ){
  }
  ionViewWillLoad(){
    this.menuCtrl.swipeEnable(false);
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }
  onFormSubmit(){
    let email = this.loginForm.get('email').value;
    let password = this.loginForm.get('password').value;
    this.submitLoading = true;
  	this._userService.checkUserLogin(email, password).subscribe(
      res => {
        this.submitLoading = false;
        if (this._authService.setUserAuthenticated(res)) {
          this._dataService.createLoading({content:'Vui lòng chờ...'}).present();
          window.location.reload();
        } 
        else {
          if(typeof res.error != 'undefined'){
              this._dataService.createAlertWithoutHandle(res.error.errors.info);
          }else{
              this._dataService.createAlertWithoutHandle(this._msgService._msg_login_failed);
          }
        }
      },
      err => {
        this.submitLoading = false;
        this._dataService.createAlertWithoutHandle(this._msgService._msg_login_failed);
        // console.log(err);
      }
    )
  }
}
