import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../../services/contact.service';
import { DataService } from '../../../common/data.service';
import { MessageService } from '../../../common/message.service';

/**
 * Generated class for the CustomerAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-contact-add',
  templateUrl: 'contact-add.html',
})
export class ContactAddPage {
  private addContactForm : FormGroup;
	modelContact:any={
		fullname:'',
		address:'',
		email:'',
		phone:''
	}
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private _contactService: ContactService,
    private _dataService: DataService,
    private _msgService: MessageService
    ) {
    this.addContactForm = new FormGroup({
        fullname: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required && Validators.email),
        phone: new FormControl('', Validators.compose([Validators.required,Validators.pattern('^[0-9]{8,15}$')]) ),
        address: new FormControl(''),
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerAddPage');

  }
  addContact(){
    // let loader = this.loadingCtrl.create({
    //   content:'Please wait ...',
    // })
    let loader = this._dataService.createLoading({content:this._msgService._msg_loading});
    loader.present();
    this._contactService.addContact(this.modelContact).subscribe(res=>{
      loader.setContent(res.message);
      if(res.code == 200) this.addContactForm.reset()
      loader.dismiss();
    });
  }
  onFormSubmit(){
  }
}
