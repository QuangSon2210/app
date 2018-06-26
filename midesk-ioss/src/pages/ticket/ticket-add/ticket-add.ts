import { Component} from '@angular/core';
import { NavController, NavParams, ModalController, PopoverController } from 'ionic-angular';
import { AuthService } from './../../../services/authentication/auth.service';
import { TicketService } from './../../../services/ticket.service';
import { ModalAssign } from'./../../../components/modal/modal-assign/modal-assign';
import { ModalRequester } from './../../../components/modal/modal-requester/modal-requester';
import { ModalProperties } from './../../../components/modal/modal-properties/modal-properties';
import { PopoverCategory } from './../../../components/popover/popover-category/popover-category';
import { PopoverStatus } from './../../../components/popover/popover-status/popover-status';
import { PopoverPriority } from './../../../components/popover/popover-priority/popover-priority';
import { TicketDetailPage} from './../ticket-detail/ticket-detail';
import { ModalMacro } from '../../../components/modal/modal-macro/modal-macro';
import { DataService } from '../../../common/data.service';
import { MessageService } from '../../../common/message.service';


@Component({
  selector: 'page-ticket-add',
  templateUrl: 'ticket-add.html'
})
export class TicketAddPage {
  page = 1;
  ticketParams = {
     assign_agent:'',
     assign_team:'',
     requester:'',
     requester_type:'',
     title:'', 
     priority:'',
     status:'',
     category:'',
     file:null,
     content:'',
     requester_customer_id:''
  }
  filterCategory={
    dataItems:[],
    dataChoose:[],
    selected:0,
    loadMore:false,
    dataChildItems:{},
  }
  checkStatus={
    new: { id : 1, name : 'Mở mới', value : 'new', color : '#C8C800', alias: 'n', checked: false  },
    open: { id : 2, name : 'Đang mở', value : 'open', color : '#C80000', alias: 'o', checked: false },
    pending: { id : 3, name : 'Đang chờ', value : 'pending', color : '#15BDE9', alias: 'p', checked: false },
    solved: { id : 4, name : 'Đã xử lý', value : 'solved', color : '#CCCCCC', alias: 's', checked: false }
  };
  privateNote:any = 0;
  priority:any={};
  checkPriority:any;
  status:any={};
  categoryName = '';
  requesterName = '';
  requesterName2 = '';
  customerName = '';
  assign = '';
  cateId = 0;
  fileName='';
  submitCreate = false;
  avatar='';
  constructor(
  	public navCtrl: NavController,
    private navParams: NavParams,
  	private _ticketService: TicketService,
  	private modalCtrl : ModalController,
    private popoverCtrl : PopoverController,
    private _authService: AuthService,
    private _dataService: DataService,
    private _msgService: MessageService
  	){
  }
  ionViewWillLoad(){
    this.checkPriority = this._authService.getPriority();
    let navData = this.navParams.get('data');
    if(navData != null && typeof navData != undefined){
        this.requesterName2 = navData.requesterName;
        this.ticketParams.requester = navData.requester;
        this.ticketParams.requester_type = navData.requester_type;
    }
  }
  changeCategory(){
    console.log(this.filterCategory.selected);
    this._ticketService.getTicketCategory(this.filterCategory.selected).subscribe(res=>{
      if(res.data!=null){
        console.log(res.data);
        this.filterCategory.dataChildItems = res.data;
      }
    });
  }
  openModalRequester(){
    let requesterModal = this.modalCtrl.create(ModalRequester,{data:this.ticketParams.requester});
    requesterModal.onDidDismiss(data=>{
      if(!data.cancel){
        console.log(data);
        this.requesterName = data.requester.name;
        this.ticketParams.requester = data.requester.id;
        this.ticketParams.requester_type = data.requester.level;
        this.ticketParams.requester_customer_id = data.customer.customer_id;
        this.customerName = data.customer.customer_name;
        if(this.customerName!=''){
          this.requesterName2 = this.requesterName+' ('+this.customerName+')';
        }else this.requesterName2 = this.requesterName;
      }
    })
    requesterModal.present();
  }
  openModalAssign() {
    let data = {selected_teamId:this.ticketParams.assign_team,selected_memberId:this.ticketParams.assign_agent};
    let contactModal = this.modalCtrl.create(ModalAssign,{data:data});
    contactModal.onDidDismiss(data=>{
      if(data!=null && typeof data != undefined){
        if(data.assign_agent.id==''){
          this.assign = data.assign_team.team_name;
          this.ticketParams.assign_team = data.assign_team.team_id;
          this.avatar = '#2979ff';
          //this.avatar = data.assign_team.color;
        }else{
          this.assign = data.assign_agent.name;
          this.ticketParams.assign_team = data.assign_team.team_id;
          this.ticketParams.assign_agent = data.assign_agent.id;
          this.avatar = '#4F4F4F';
          //this.avatar = data.assign_agent.color;
        }
      }
    })
    contactModal.present();
 	}
  openPopoverStatus(){
    let popoverStatus = this.popoverCtrl.create(PopoverStatus,{data:this.ticketParams.status},{cssClass:"custom-status",enableBackdropDismiss:true})
    popoverStatus.onDidDismiss(data=>{
      if(data!=null && typeof data!=undefined){
        this.ticketParams.status = data.status.value;
        this.status = data.status;
      }
    })
    popoverStatus.present();
  }
  openPopoverPriority(){
    let popoverPriority = this.popoverCtrl.create(PopoverPriority,{data:this.ticketParams.priority},{cssClass:"custom-priority",enableBackdropDismiss:true})
    popoverPriority.onDidDismiss(data=>{
      if(data!=null && typeof data!=undefined){
       this.ticketParams.priority = data.priority.id;
       this.priority = data.priority;
      }
    })
    popoverPriority.present();
  }
  openPopoverCategory(){
    let categoryPopover = this.popoverCtrl.create(PopoverCategory,{data:[]},{cssClass:"custom-popup",enableBackdropDismiss:false});
    categoryPopover.onDidDismiss(data=>{
      if(!data.cancel){
        this.ticketParams.category='';
        this.categoryName='';
        console.log(data);
          for(let i = 0; i<data.data.length;i++){
            //this.ticketParams.category+=data.data[i].id+',';
            this.categoryName +=data.data[i].name+'/';
          }
          //this.ticketParams.category = data.data[data.data.length-1].id;
      }
    })
    categoryPopover.present();
  }
  openModalProperties(){
    let data={
      id:0,
      status:(this.ticketParams.status!='')?this.checkStatus[this.ticketParams.status]:'',
      priority:(this.ticketParams.priority!='')?this.checkPriority[parseInt(this.ticketParams.priority)-1]:'',
      title:this.ticketParams.title,
      requester:(this.requesterName!='')?{'name':this.requesterName,'id':this.ticketParams.requester}:'',
      customer:(this.customerName!='')?{'customer_id':this.ticketParams.requester_customer_id,'customer_name':this.customerName}:'',
      assign:(this.assign!='')?{'name':this.assign,'assign_team':this.ticketParams.assign_team,'assign_agent':this.ticketParams.assign_agent}:''
    }
    //let modal = this.modalCtrl.create(ModalProperties,{data});
    let propertiesModal = this.modalCtrl.create(ModalProperties,{data:data});
    propertiesModal.onDidDismiss(data=>{
      let self = this;
      let flag = false;
      if(Object.keys(data).length>0){
        Object.keys(data).forEach(function(key){
          switch(key){
            case 'status':
              self.status = self.checkStatus[data['status']];
              self.ticketParams.status= data['status'];
              break;
            case 'priority':
              self.priority = self.checkPriority[data['priority']-1];
              self.ticketParams.priority = data['priority'];
              break;
            case 'title':
              self.ticketParams.title = data['title'];
              break;
            case 'assign':
              self.ticketParams.assign_agent = data['assign']['agent'];
              self.ticketParams.assign_team = data['assign']['team'];
              self.assign = data['assign']['name'];
              self.avatar = (data['assign']['agent']==0)?'#2979ff':'#4F4F4F';
              break;
            case 'requester':
              self.requesterName = data.requester.requester_name;
              self.ticketParams.requester = data.requester.requester;
              self.ticketParams.requester_type = data.requester.requester_type;
              self.ticketParams.requester_customer_id = data.requester.requester_customer_id;
              self.customerName = data.requester.customer_name;
              if(self.customerName!=''){
                self.requesterName2 = self.requesterName+' ('+self.customerName+')';
              }else self.requesterName2 = self.requesterName;
              break;
            case 'category':
              self.ticketParams.category = data['category']['id'];
              break;
          }
        })
      }
    })
    propertiesModal.present();
  }
  openMacro(){
    let macroModal = this.modalCtrl.create(ModalMacro);
    macroModal.present();
  }
  onChangeUpload($event){
    this.ticketParams.file = $event.target.files[0];
    this.fileName = $event.target.files[0].name;
  }
  createTicket(){
    console.log(this.ticketParams);
    let loader = this._dataService.createLoading({content:this._msgService._msg_loading});
    var formData = new FormData();
    formData.append('title',this.ticketParams.title);
    formData.append('assign_agent',this.ticketParams.assign_agent);
    formData.append('assign_team',this.ticketParams.assign_team);
    formData.append('priority',this.ticketParams.priority);
    formData.append('requester',this.ticketParams.requester);
    formData.append('requester_type',this.ticketParams.requester_type);
    formData.append('status',this.ticketParams.status);
    formData.append('content',this.ticketParams.content);
    formData.append('private',this.privateNote);
    formData.append('requester_customer_id',this.ticketParams.requester_customer_id);
    formData.append('category',this.ticketParams.category);
    if(this.ticketParams.file!=null){
      formData.append('file',this.ticketParams.file,this.ticketParams.file.name);
    }
    loader.present().then(()=>{
        this._ticketService.createTicket(formData).subscribe(res=>{
        loader.dismiss();
        if(res.code==200){
          this._dataService.createToast(res.message,2000,'success-toast');
          this.resetInput();
          var self = this;
          setTimeout(function(){
            let promt = self._dataService.createAlertWithHandle(self._msgService._msg_ticket_go_view);
            promt.present();
            promt.onDidDismiss(data=>{
                if(data){
                  self.navCtrl.push(TicketDetailPage,{data:res.data.ticket});
                }
            })
          },1500);
        }
        else this._dataService.createToast(res.message,2000,'fail-toast');
      });
    })
  }
  clearAssign(){
    this.ticketParams.assign_agent = '';
    this.ticketParams.assign_team = '';
    this.assign= '';
  }
  clearRequester(){
    this.ticketParams.requester = '';
    this.ticketParams.requester_customer_id = '';
    this.requesterName = '';
    this.requesterName2 = '';
    this.ticketParams.requester_type = '';
  }
  resetInput(){
    this.ticketParams = {
      assign_agent:'',
      assign_team:'',
      requester:'',
      requester_type:'',
      title:'', 
      priority:'',
      status:'',
      category:'',
      file:null,
      content:'',
      requester_customer_id:''
    }
    this.clearAssign();
    this.clearRequester();
  }
  ionViewWillEnter(){
    let self = this;
    this._dataService.listenEvent('MACRO').subscribe(data=>{
      if(data['assignName']!='') {
        this.assign = data['assignName'];
        this.avatar = '#4F4F4F';
      }
      else{
        if(data['teamName']!=''){
          this.assign = data['teamName'];
          this.avatar = '#2979ff';
        } 
      }
      Object.keys(data['dataMacro']).forEach(function(key) {
        //self.ticketParams[key] = data['dataMacro'][key];
        switch(key){
          case 'private' || 'public':
            self.privateNote = data['dataMacro'][key];
            self.ticketParams[key] = data['dataMacro'][key]
            break;
          case 'status':
            self.ticketParams[key] = data['dataMacro'][key]
            self.status = self.checkStatus[data['dataMacro'][key]];
            break;
          case 'priority':
            self.ticketParams[key] = data['dataMacro'][key]
            self.priority = self.checkPriority[data['dataMacro'][key]-1];
            break;
        }
      });   
    })
  }
}


