import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ContactService } from './../../../services/contact.service';
import { TicketService } from './../../../services/ticket.service';
import { TicketDetailPage } from './../../ticket/ticket-detail/ticket-detail';
import { TicketAddPage } from './../../ticket/ticket-add/ticket-add';
import { DataService } from '../../../common/data.service';
import { MessageService } from '../../../common/message.service';
/**
 * Generated class for the contactProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-contact-profile',
  templateUrl: 'contact-profile.html',
})
export class ContactProfilePage {
	contactProfile = {};
  contactTicket = [];
  loading = false;
  edit = false;
	section = 'segment1';
  modelEdit={
    fullname:'',
    address:'',
    phone:'',
  };
  modelUpdate:any={};
  contactId:number;
  contactName:any;
  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams, 
      private _contactService: ContactService,
      private _ticketService: TicketService,
      private _dataService: DataService,
      private _msgService: MessageService
      ) {
        this.contactId = this.navParams.get('id');
    this.initcontactProfile();
    this.initListTicketBycontact();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad contactProfilePage');
    
  }
  initcontactProfile(){
    this.loading = true;
    this._contactService.getContactProfile(this.navParams.get('id')).subscribe(res=>{
      this.contactProfile = res;
      this.modelEdit.fullname = res.fullname;
      this.modelEdit.address = res.address;
      this.modelEdit.phone = res.phone;
      this.loading = false;
    })
  }
  editProfile(){
    this.edit = true;
  }
  initListTicketBycontact(){
    this._ticketService.getTicketByContact(this.contactId).subscribe(res =>{
      this.contactTicket = res;
    });
  }
  updateProfile(){
    if(Object.keys(this.modelUpdate).length>0){
      let loading = this._dataService.createLoading({content:this._msgService._msg_loading});
      loading.present();
      this._contactService.updateContact({dataUpdate:this.modelUpdate,contactId:this.contactId}).subscribe(res=>{
        if(res.code==200){
          this.initcontactProfile();
          loading.setContent(res.message);
          this.edit = false;
        }
      loading.dismiss();  
      });
    }
    else this.closeEdit();
  }
  openTicketDetail(index){
    this.navCtrl.push(TicketDetailPage,{data:index});
  }
  openAddTicket(){
    let data = {
      requester:this.contactProfile['id'],
      requester_type:'contact',
      requesterName:this.contactProfile['fullname']
    }
    this.navCtrl.push(TicketAddPage,{data:data});
  }
  closeEdit(){
    this.edit = false;
    this.modelEdit.fullname = this.contactProfile['fullname'];
    this.modelEdit.address = this.contactProfile['address'];
    this.modelEdit.phone = this.contactProfile['phone'];
  }
  onInsertData($event,$type){
    if($type=='fullname'){
      if($event.target.value != this.contactProfile['fullname']){
        this.modelUpdate['fullname'] = $event.target.value;
      }
      else{
        delete this.modelUpdate['fullname'];
      }
    }
    if($type=='phone'){
      if($event.target.value != this.contactProfile['phone']){
        this.modelUpdate['phone'] = $event.target.value;
      }
      else{
        delete this.modelUpdate['phone'];
      }
    }
    if($type=='address'){
      if($event.target.value != this.contactProfile['address']){
        this.modelUpdate['address'] = $event.target.value;
      }
      else{
        delete this.modelUpdate['address'];
      }
    }
  }

}
