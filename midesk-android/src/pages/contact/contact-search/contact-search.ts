import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ContactService } from '../../../services/contact.service';

/**
 * Generated class for the CustomerSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-contact-search',
  templateUrl: 'contact-search.html',
})
export class ContactSearchPage {
  modelSearch={
    text:'',
    dataItems:[],
    dataLoading:false,
    dataTotal:0,
    dataPage:1,
    loadMore:false,
    currentData:0,
  }
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private viewCtrl: ViewController,
    private _contactService: ContactService
  ) {
  }

  closeModal(){
  	this.viewCtrl.dismiss();
  }
  clearSearch(){
    this.modelSearch.text = '';
    this.modelSearch.dataItems = [];
    this.modelSearch.loadMore = false;
    this.modelSearch.dataTotal = 0;
    this.modelSearch.dataLoading = false;
    this.modelSearch.dataPage = 1;
  }
  onSearchTicket($event){
    if($event.keyCode == 13){
      this.modelSearch.text = ($event.target.value);
      this.modelSearch.dataLoading = true;
      this._contactService.searchContact(this.modelSearch).subscribe(res=>{
        this.modelSearch.dataItems = res.data;
        this.modelSearch.dataTotal = res.total;
        this.modelSearch.currentData = res.to;
        if(res.next_page_url!==null) this.modelSearch.loadMore = true;
        else this.modelSearch.loadMore = false;
        this.modelSearch.dataLoading = false;
      })
    }
  }
  ionViewWillLoad() {
    
  }
  doInfinite(infiniteScroll){
    this.modelSearch.dataPage += 1;
  	this._contactService.searchContact(this.modelSearch).subscribe(res=>{
      this.modelSearch.dataItems.push(...res.data);
      this.modelSearch.currentData = res.to;
      if(res.next_page_url!==null) this.modelSearch.loadMore = true;
      else this.modelSearch.loadMore = false;
      this.modelSearch.dataLoading = false;
    })
  }
  // clickTicket(index){
  // 	console.log(index);
  //   this.navCtrl.push(TicketDetailPage,{data:index});
  // }

}
