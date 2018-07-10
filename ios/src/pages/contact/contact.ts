import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ContactService } from './../../services/contact.service';
import { ContactProfilePage } from'./contact-profile/contact-profile';
import { ContactAddPage } from'./contact-add/contact-add';
import { ContactSearchPage } from './contact-search/contact-search';
import { AuthService } from '../../services/authentication/auth.service';

/**
 * Generated class for the CustomerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  loading = false;
  modelContact:any = {
  	dataItems:[],
  	dataPage:1,
  	loadMore:false,
  };

  constructor(
  		public navCtrl: NavController, 
  		public navParams: NavParams,
      private _contactService: ContactService,
      private _authService: AuthService
    ) {
  }

  ionViewDidLoad() {
    this.initListContact();
  }
  initListContact(){
    console.log(this._authService.getRelation());
  	this.loading = true;
  	this._contactService.getListContact(this.modelContact.dataPage).subscribe(res=>{
  		console.log(res.data);
  		this.modelContact.dataItems = res.data;
      if(res.next_page_url!==null) this.modelContact.loadMore = true;
      else this.modelContact.loadMore = false;
  		this.loading = false;
  	})
  }
  contactProfile(index){
  	this.navCtrl.push(ContactProfilePage,{id:index.id});
  }
  openSearchContact(){
    this.navCtrl.push(ContactSearchPage);
  }
  openAddContact(){
    this.navCtrl.push(ContactAddPage);
  }
  doInfinite(infiniteScroll){
    this.modelContact.dataPage += 1;
    //this.loading = true;
    this._contactService.getListContact(this.modelContact.dataPage).subscribe(res=>{
      this.modelContact.dataItems.push(...res.data);
      if(res.next_page_url!==null) this.modelContact.loadMore = true;
      else this.modelContact.loadMore = false;
      //this.loading = false;
      infiniteScroll.complete();
    })
  }
  doRefresh(refresher) {
      this.modelContact.dataPage = 1;
      this.initListContact();
      refresher.complete();
  }
}
