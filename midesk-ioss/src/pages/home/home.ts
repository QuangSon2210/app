import { NotificationsService } from './../../services/notifications.service';
import { Component, ViewChild, Injectable } from '@angular/core';
import { NavController, Select,  ModalController, PopoverController, Platform } from 'ionic-angular';
import { AuthService } from './../../services/authentication/auth.service';
import { TicketService } from './../../services/ticket.service';
import { TicketDetailPage } from './../ticket/ticket-detail/ticket-detail';
import { ModalSearchTicket } from './../../components/modal/modal-search-ticket/modal-search.component';
import { PopoverSort } from './../../components/popover/popover-sort/popover-sort';
import { PopoverChannel } from './../../components/popover/popover-channel/popover-channel';
import { SocketService } from '../../common/socket.service';
import { DataService } from '../../common/data.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
@Injectable()
export class HomePage {
  @ViewChild('sectionSelect') sectionSelect: Select;
  @ViewChild('popoverChannel') popoverChannel: Select;
  arraySort:any=[
      { id: 'desc', name: 'Mới nhất', value: 'desc' },
      { id: 'asc', name: 'Cũ nhất', value: 'asc' },
  ];
  arrayFilter:any=[
    { id:'filter1', name:'Phiếu chưa xử lý của bạn', value: 'yêu cầu chưa giải quyết của bạn' },
    { id:'filter2', name:'Phiếu chưa xử lý trong bộ phận', value: 'yêu cầu chưa giải quyết trong bộ phận' },
    { id:'filter3', name:'Phiếu chưa phân công', value: 'yêu cầu chưa phân công' },
    { id:'filter4', name:'Phiếu đang chờ xử lý', value: 'yêu cầu đang chờ xử lý' },
    { id:'filter5', name:'Phiếu đã xử lý', value: 'yêu cầu đã xử lý' },
    { id:'filter6', name:'Phiếu tạo bởi bạn', value: 'yêu cầu tạo bởi bạn' },
    { id:'filter7', name:'Phiếu đã xóa', value: 'yêu cầu đã xóa'}
];
  status:any=[
      { id : 1, name : 'Mở mới', value : 'new', color : '#C8C800', alias: 'n', checked: false  },
      { id : 2, name : 'Đang mở', value : 'open', color : '#C80000', alias: 'o', checked: false },
      { id : 3, name : 'Đang chờ', value : 'pending', color : '#15BDE9', alias: 'p', checked: false },
      { id : 4, name : 'Đã xử lý', value : 'solved', color : '#CCCCCC', alias: 's', checked: false }
  ];
  orderBy=[
    { id : 1, name : 'Ngày cập nhật mới nhất', value : 'dateupdate', checked: false  },
    { id : 2, name : 'Ngày khởi tạo mới nhất', value : 'datecreate', checked: false },
    { id : 3, name : 'Người xử lý', value : 'assign_agent', checked: false },
    { id : 4, name : 'Người yêu cầu', value : 'request', checked: false }
  ];
  priority=[];
  filterTicket:any={
  	filterBy:'yêu cầu chưa giải quyết của bạn',
  	sortBy:'desc'
  };
  modelTicket:any={
  	dataItems:[],
  	dataPage:1,
    dataLoading:false,
    dataTotal:0,
    loadMore:false,
    filterBy:'yêu cầu chưa giải quyết của bạn',
    sortBy:[],
    channel:'all',
    orderBy:'',
  };
  filterOption = {
    cssClass: 'my-class'
  } 
  countList:any=[];
  countNotify:any;
  room:any={};
  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private _ticketService: TicketService,
    private modalCtrl: ModalController,
    private _authService: AuthService,
    private _notifyService: NotificationsService,
    private _socketService: SocketService,
    private _dataService: DataService,
    private _platform: Platform
    ) {
    this.initApp();
  }
  initApp(){
    this._platform.ready().then(()=>{
      // this.room=JSON.parse(this._authService.getLoggedInRoom());
      // let self = this;
      // setTimeout(function(){
      //   self._socketService.connect();
      //   self._socketService.emitData('room',self.room);
      // },2000);
      this.listenEventNewNotifi();
      this.listenEventUpdate();
      this._notifyService.countNewNotifications().subscribe(res=>{ this.countNotify = res;});
      this.loadCountTicket();
      this.initListTicket();
      this.priority = this._authService.getPriority();
    })
  }
  loadCountTicket(){
    this._ticketService.countTicket().subscribe(res=>{
        this.countList['filter1'] = res.filter1;
        this.countList['filter2'] = res.filter2;
        this.countList['filter3'] = res.filter3;
        this.countList['filter4'] = res.filter4;
        this.countList['filter5'] = res.filter5;
        this.countList['filter6'] = res.filter6;
        this.countList['filter7'] = res.filter7;
    })
  }
  initListTicket(){
    this.modelTicket.dataLoading = true;
    this._ticketService.getListTicket(this.modelTicket).subscribe(res=>{
      this.modelTicket.dataItems = res.data;
      if(res.next_page_url!==null) this.modelTicket.loadMore = true;
      else this.modelTicket.loadMore = false;
      this.modelTicket.dataLoading = false;
    });
  }
  doRefresh(refresher) {
      this.modelTicket.dataPage = 1;
      this.modelTicket.dataTotal = 0;
      this.initListTicket();
      refresher.complete();
  }
  doInfinite(infiniteScroll){
  	this.modelTicket.dataPage += 1;
  	this._ticketService.getListTicket(this.modelTicket).subscribe(res=>{
  		this.modelTicket.dataItems.push(...res.data);
  		if(res.next_page_url!==null) this.modelTicket.loadMore = true;
      else this.modelTicket.loadMore = false;
      this.modelTicket.dataLoading = false;
      this.initListTicket();
      console.log(this.modelTicket.dataItems);
      infiniteScroll.complete();
    })
  }
  doLoadMore($type){
    if(this.modelTicket.dataPage>1){
      this.modelTicket.dataPage = ($type='next')?this.modelTicket.dataPage+1:this.modelTicket.dataPage-1;
      this._ticketService.getListTicket(this.modelTicket).subscribe(res=>{
        this.modelTicket.dataItems = res.data;
        if(res.next_page_url!==null) this.modelTicket.loadMore = true;
        else this.modelTicket.loadMore = false;
        this.modelTicket.dataLoading = false;
        this.initListTicket();
        console.log(this.modelTicket.dataItems);
      })
    }
  }
  openModal(){
    let contactModal = this.modalCtrl.create(ModalSearchTicket);
    contactModal.present();
  }
  doSort(){
  	this.sectionSelect.open();
  }
  clickTicket(index){
  	console.log(index);
    this.navCtrl.push(TicketDetailPage,{data:index});
  }
  doFilter(){
    this.modelTicket.dataItems=[];
    this.modelTicket.dataPage=1;
    this.modelTicket.dataTotal=0;
    this.initListTicket();
    console.log(this.modelTicket.filterBy);
  }
  openPopoverSort(myEvent) {
    let data = {priority:this.priority,status:this.status,orderBy: this.orderBy}
    let popover = this.popoverCtrl.create(PopoverSort,data,{cssClass:"custom-sort",enableBackdropDismiss: true });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data=>{
      if(typeof data!=undefined && data!=null){
        this.modelTicket.sortBy={status:data.status,priority:data.priority};
        this.modelTicket.orderBy = data.orderBy;
        this.modelTicket.dataPage=1;
        this.modelTicket.dataTotal=0;
        this.initListTicket();
      }
      console.log(this.modelTicket);
      console.log(data);
      //
    });
  }
  openPopoverChannel(myEvent){
    let data = this.modelTicket.channel;
    let popover = this.popoverCtrl.create(PopoverChannel,{data:data},{cssClass:"custom-channel",enableBackdropDismiss: true });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data=>{
      if(typeof data!=undefined && data !=null){     
        this.modelTicket.channel = data.channel;
        this.modelTicket.dataPage=1;
        this.modelTicket.dataTotal=0;
        this.initListTicket(); 
      }
    });
  }
  listenEventNewNotifi(){
    console.log(JSON.parse(this._authService.getLoggedInRoom()).array_agent.split(','));
    let userId = this._authService.getLoggedInUser().id;
    let teamId = JSON.parse(this._authService.getLoggedInRoom()).array_team.split(',');
    this._socketService.listenEvent('NEW NOTIFI').subscribe(res=>{
      if(res[0]['view'] != userId && res[0]['del_agent'] != userId && teamId.indexOf(res[0]['id_team'],0)!=-1 || userId == res[0]['id_user']){
        this.countNotify+=1;
        this.loadCountTicket();
      }
    });
  }
  listenEventUpdate(){
    this._dataService.listenEvent('UPDATE NOTIFI').subscribe(res=>{
      this.countNotify-=1;
    })
    this._dataService.listenEvent('UPDATE TICKET').subscribe(res=>{
      this.loadCountTicket();
      this.initListTicket();
    })
  }
}
