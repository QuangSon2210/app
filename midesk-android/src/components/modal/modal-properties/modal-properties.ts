import { Component } from '@angular/core';
import { NavParams, ViewController, PopoverController, ModalController } from 'ionic-angular';
import { PopoverCategory } from './../../popover/popover-category/popover-category';
import { PopoverStatus } from '../../popover/popover-status/popover-status';
import { PopoverPriority } from '../../popover/popover-priority/popover-priority';
import { SocketService } from '../../../common/socket.service';
import { ModalAssign } from '../modal-assign/modal-assign';
import { ModalRequester } from '../modal-requester/modal-requester';
import { TicketService } from '../../../services/ticket.service';

@Component({
	selector: 'modal-properties',
	templateUrl: 'modal-properties.html',
})
export class ModalProperties{
	categoryName = '';
	category:any;
	categoryDefault:any;
	statusDefault:any;
	priorityDefault:any;
	titleDefault:any;
	assign:any={};
	requesterName='';
	requesterId:any;
	customerName = '';
	name='';
	dataUpdate:any={};
	status:any=[
		{ id : 1, name : 'Mở mới', value : 'new', color : '#C8C800', alias: 'n', checked: false  },
		{ id : 2, name : 'Đang mở', value : 'open', color : '#C80000', alias: 'o', checked: false },
		{ id : 3, name : 'Đang chờ', value : 'pending', color : '#15BDE9', alias: 'p', checked: false },
		{ id : 4, name : 'Đã xử lý', value : 'solved', color : '#CCCCCC', alias: 's', checked: false },
		{ id : 5, name : 'Đóng', value : 'closed', color : '#CCCCCC', alias: 'c', checked: false }
	];
	checkStatus={
    new: { id : 1, name : 'Mở mới', value : 'new', color : '#C8C800', alias: 'n', checked: false  },
    open: { id : 2, name : 'Đang mở', value : 'open', color : '#C80000', alias: 'o', checked: false },
    pending: { id : 3, name : 'Đang chờ', value : 'pending', color : '#15BDE9', alias: 'p', checked: false },
	solved: { id : 4, name : 'Đã xử lý', value : 'solved', color : '#CCCCCC', alias: 's', checked: false },
	closed: { id : 5, name : 'Đóng', value : 'closed', color : '#CCCCCC', alias: 'c', checked: false }
  };
	constructor(
		public navParams: NavParams,
		private viewCtrl: ViewController,
		private popoverCtrl: PopoverController,
		private _socketService: SocketService,
		private modalCtrl: ModalController,
		private _ticketService: TicketService
	){
		this.listenEventUpdateTicket();
	}
	ionViewWillLoad() {
		let data = (this.navParams.get('data'));
		this.statusDefault = data.status;
		this.priorityDefault = data.priority;
		this.titleDefault = data.title;
		if(typeof data.category != 'undefined'){
			this.categoryDefault = data.category;
			if(this.categoryDefault['id']!= '' && this.categoryDefault['id'] != null){
				this._ticketService.getCategoryName(this.categoryDefault['parent2']).subscribe(res=>{
					this.category = res;
				})
			}
		} 
		this.name = data.assign.name;
		if(data.assign!=''){
			this.assign.assign_agent = data.assign.assign_agent;
			this.assign.assign_team = data.assign.assign_team;
			this.name = data.assign.name;
		}else this.name = '';
		if(data.requester!=''){
			this.requesterName = data.requester.name;
			this.requesterId = data.requester.id;
		}else this.requesterName = '';
		if(data.customer!=''){
			this.customerName = data.customer.customer_name;
		}else this.customerName = '';
		//this.name = (this.assign.agent_name!='')?this.assign.agent_name:this.assign.team_name;
	}
	listenEventUpdateTicket(){
    this._socketService.listenEvent('NEW_UPDATE_TICKET').subscribe(data=>{
      let arr:any = data;
      for(let i=0;i<arr.length;i++){
        if(data[i].ticket_id==this.navParams.get('data').id){
          let content =JSON.parse(data[i].content);
          let self = this;
          Object.keys(content).forEach(function(key){
						switch(key){
							case 'assign_agent':
								if(content[key]['id'] != self.assign.assign_agent){
									self.assign.assign_agent = content[key]['id'];
									self.assign.agent_name = content[key]['name'];
									self.name = self.assign.agent_name;
									if(typeof self.dataUpdate[key] != 'undefined' && self.dataUpdate[key] != content[key]['id']){
										self.dataUpdate[key] = content[key]['id'];
										self.dataUpdate['assign_team'] = content['assign_team']['id'];
									}
								}
								break;
							case 'assign_team':
								if(content[key]['id'] != self.assign.assign_team){
									self.assign.assign_team = content[key]['id'];
									self.assign.team_name = content[key]['name'];
									if(typeof self.dataUpdate[key] != 'undefined' && self.dataUpdate[key] != content[key]['id']){
										self.dataUpdate[key] = content[key]['id'];
									}
									self.name = (self.name=='') ? self.assign.team_name : self.name;
								}
								break;
							case 'priority':
								if(content[key]['id'] != self.priorityDefault.id){
									self.priorityDefault = content[key];
									if(typeof self.dataUpdate[key] != 'undefined' && self.dataUpdate[key] != content[key]['id']){
										self.dataUpdate[key] = content[key]['id'];
									}
								}
								break;
							case 'title':
								if(content[key] != self.titleDefault){
									self.titleDefault = content[key];
								}
								break;
							case 'status':
								if(content[key] != self.statusDefault.value){
									self.statusDefault = self.checkStatus[content[key]];
									if(typeof self.dataUpdate[key] != 'undefined' && self.dataUpdate[key] != content[key]){
										self.dataUpdate[key] = content[key];
									}
								}
								break;
							case 'category':
								if(content[key] != self.categoryDefault.id){
									// self.categoryDefault.id = content[key]['id'];
									// self.categoryDefault.parent2 = content[key]['parent2'];
									self.categoryDefault = content[key];
									self._ticketService.getCategoryName(content[key]['parent2']).subscribe(res=>{
										self.category = res;
										if(typeof self.dataUpdate[key] != 'undefined' && self.dataUpdate[key] != content[key]){
											self.dataUpdate[key] = content[key];
										}
									}) 
								}
								break;
						}
					})
					// self.name = (self.assign.agent_name!='') ? self.assign.agent_name : self.assign.team_name;
					// console.log(self.name);
        }
      }
      // if(flag){
      //   this.countChange = Object.keys(this.ticketUpdateDetail).length + Object.keys(this.ticketUpdate).length;
      //   this._dataService.createToast('Dữ liệu đã bị thay đổi trước đó, bạn vui lòng thực hiện lại các thao tác hoặc tải lại phiếu',4000,'fail-toast');
      // }
    })
  }
	closeModal(){
  	this.viewCtrl.dismiss(this.dataUpdate);
	}
	changeTitle($event){
		if(this.titleDefault!=$event.target.value){
			this.dataUpdate['title'] = $event.target.value;
		}else delete this.dataUpdate['title'];
	}
	changeStatus(){
		let popoverStatus = this.popoverCtrl.create(PopoverStatus,{data:this.statusDefault.value,action:this.navParams.get('data').action},{cssClass:"custom-status",enableBackdropDismiss:true})
		popoverStatus.onDidDismiss(data=>{
		  if(data!=null && typeof data!=undefined){
			this.statusDefault = data.status;
			this.dataUpdate['status'] = data.status.value;
		  }
		})
		popoverStatus.present();
	}
	changePriority(){
		let popoverPriority = this.popoverCtrl.create(PopoverPriority,{data:this.priorityDefault.id},{cssClass:"custom-priority",enableBackdropDismiss:true})
		popoverPriority.onDidDismiss(data=>{
		  if(data!=null && typeof data!=undefined){
			this.priorityDefault = data.priority;
			this.dataUpdate['priority'] = data.priority.id;
		  }
		})
		popoverPriority.present();	 
	}  
	openPopoverCategory(){
		let categoryPopover = this.modalCtrl.create(PopoverCategory,{data:[]},{cssClass:"custom-popup",enableBackdropDismiss:true});
		categoryPopover.onDidDismiss(data=>{
			if(data!=null && typeof data!=undefined){
				let tmp = data[data.length-1]['id'];
				if(tmp!=this.categoryDefault){
					this.category = data;
					this.categoryDefault = tmp;
					this.dataUpdate['category'] = {id:tmp,data:data}
				}	
			}
		})
		categoryPopover.present();
	}
	openModalAssign() {
		let data = {selected_teamId:this.assign.assign_team,selected_memberId:this.assign.assign_agent};
		let contactModal = this.modalCtrl.create(ModalAssign,{data:data});
		contactModal.onDidDismiss(data=>{
			if(data!=null && typeof data != undefined){
				if(this.assign.assign_team==data.assign_team.team_id){
					if(data.assign_agent.id!=''){
						this.name = data.assign_agent.name;
						this.dataUpdate['assign'] = { agent: data.assign_agent.id, team: data.assign_team.team_id, name: this.name };
					}else{
						this.name = data.assign_team.team_name;
						this.dataUpdate['assign'] = { agent: 0, team: data.assign_team.team_id, name: this.name };
					}
				}
				else{
					if(data.assign_agent.id!=''){
						this.name = data.assign_agent.name;
						this.dataUpdate['assign'] = { agent: data.assign_agent.id, team: data.assign_team.team_id, name: this.name };
					}
					else{
						this.name = data.assign_team.team_name;
						this.dataUpdate['assign'] = { agent: 0, team: data.assign_team.team_id, name: this.name };
					}
				}
				// console.log(this.dataUpdate);
			}
			//this.countChange = Object.keys(this.ticketUpdate).length;
		})
		contactModal.present();
		}
		openModalRequester(){
			let requesterModal = this.modalCtrl.create(ModalRequester,{data:this.requesterId});
			requesterModal.onDidDismiss(data=>{
				if(!data.cancel){
					this.requesterName = data.requester.name;
					this.customerName = data.customer.customer_name;
					if(data.requester.id!=0){
						this.dataUpdate['requester'] = { requester: data.requester.id, requester_type: data.requester.level, requester_customer_id: data.customer.customer_id, requester_name: data.requester.name, customer_name: this.customerName};
					}
				}
			})
			requesterModal.present();
		}
	
}