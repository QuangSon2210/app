import { Component } from '@angular/core';
import { NavParams, ViewController, NavController } from 'ionic-angular';
import { TicketService } from './../../../services/ticket.service';
import { TicketDetailPage } from '../../../pages/ticket/ticket-detail/ticket-detail';

/**
 * Generated class for the ModalRequesterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'app-modal-search',
  templateUrl: 'modal-search.html',
})
export class ModalSearchTicket {
  status:any=[
      { id : 1, name : 'Mở mới', value : 'new', color : '#C8C800', alias: 'n'  },
      { id : 2, name : 'Đang mở', value : 'open', color : '#C80000', alias: 'o' },
      { id : 3, name : 'Đang chờ', value : 'pending', color : '#15BDE9', alias: 'p' },
      { id : 4, name : 'Đã xử lý', value : 'solved', color : '#CCCCCC', alias: 's' }
  ];
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
  	public navParams: NavParams, 
  	private viewCtrl: ViewController,
    private _ticketService: TicketService,
    private navCtrl: NavController
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
      this._ticketService.searchTicket(this.modelSearch).subscribe(res=>{
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
  	this._ticketService.searchTicket(this.modelSearch).subscribe(res=>{
      this.modelSearch.dataItems.push(...res.data);
      this.modelSearch.currentData = res.to;
      if(res.next_page_url!==null) this.modelSearch.loadMore = true;
      else this.modelSearch.loadMore = false;
      this.modelSearch.dataLoading = false;
    })
  }
  clickTicket(index){
  	console.log(index);
    this.navCtrl.push(TicketDetailPage,{data:index});
  }
}
