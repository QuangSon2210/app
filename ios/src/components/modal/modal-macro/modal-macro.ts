import { Component } from '@angular/core';
import { NavParams, ViewController, NavController } from 'ionic-angular';
import { TicketService } from '../../../services/ticket.service';
import { MacroDetail } from './macro-detail/macro-detail';

/**
 * Generated class for the ModalRequesterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'modal-macro',
  templateUrl: 'modal-macro.html',
})
export class ModalMacro {
  macro:any;
  action:any;
  dataMacro:any={};
  status:any={};
  priority:any={};
  checkStatus={
    new: { id : 1, name : 'Mở mới', value : 'new', color : '#C8C800', alias: 'n', checked: false  },
    open: { id : 2, name : 'Đang mở', value : 'open', color : '#C80000', alias: 'o', checked: false },
    pending: { id : 3, name : 'Đang chờ', value : 'pending', color : '#15BDE9', alias: 'p', checked: false },
    solved: { id : 4, name : 'Đã xử lý', value : 'solved', color : '#CCCCCC', alias: 's', checked: false }
  };
  checkPriority:any;
  arrCheck:any=[];
  teamName = '';
  assignName= '';
  constructor(
  	public navParams: NavParams, 
    private viewCtrl: ViewController,
    private _ticketService: TicketService,
    private navCtrl: NavController,
  ) {
    this.initMacro();
  }
  initMacro(){
    this._ticketService.getMacro().subscribe(res=>{
      this.macro = res;
    })
  }
  closeModal(){
      this.viewCtrl.dismiss();
  }
  // initDetail(){
  //   this.action = JSON.parse(this.macro.action);
  //   for(let i = 0; i < this.action.length;i++){
  //     switch(this.action[i]['type']){
  //       case 'priority': 
  //         this.dataMacro.priority = this.action[i]['value'];
  //         this.priority = this.checkPriority[this.action[i]['value']-1];
  //         this.arrCheck.push({type:'priority'}); 
  //         break;
  //       case 'status': 
  //         this.dataMacro.status = this.action[i]['value'];
  //         this.status = this.checkStatus[this.action[i]['value']];
  //         this.arrCheck.push({type:'status'}); 
  //         break;
  //       case 'public_reply': 
  //         this.dataMacro.content = this.action[i]['value']; 
  //         this.dataMacro.private = 0; 
  //         this.arrCheck.push({type:'content'}); 
  //         break;
  //       case 'private_reply':
  //         this.dataMacro.content = this.action[i]['value']; 
  //         this.dataMacro.private = 1; 
  //         this.arrCheck.push({type:'content'});  
  //         break; 
  //       case 'assign_agent':
  //         this.dataMacro.assign_agent = this.action[i]['value'];
  //         this.arrCheck.push({type:'assign_agent'});
  //         this._userService.getUserName(this.action[i]['value']).subscribe(res=>{
  //           this.assignName = res.name;
  //         })
  //         break;
  //       case 'assign_team':
  //         this.dataMacro.assign_team = this.action[i]['value'];
  //         this.arrCheck.push({type:'assign_team'});
  //         this._userService.getUserInTeam(this.action[i]['value']).subscribe(res=>{
  //           this.teamName = res.info.team_name;
  //         })
  //         break;
  //     }
  //   }
  //   console.log(this.dataMacro);
  // }
  actionMacro(index){
    // let modalDetail = this.modalCtrl.create(MacroDetail);
    this.navCtrl.push(MacroDetail,{data:index});
    // this.viewCtrl.dismiss(this.dataMacro);
  }
}
