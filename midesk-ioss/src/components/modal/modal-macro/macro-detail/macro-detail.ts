import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { AuthService } from '../../../../services/authentication/auth.service';
import { UserService } from '../../../../services/user.service';
import { TicketService } from '../../../../services/ticket.service';
import { resolveNgModuleDep } from '@angular/core/src/view/ng_module';
/**
 * Generated class for the MacroDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-macro-detail',
  templateUrl: 'macro-detail.html',
})
export class MacroDetail {
  macro:any={};
  action:any;
  dataMacro:any={};
  status:any={};
  priority:any={};
  category:any=[];
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
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private viewCtrl: ViewController,
    private _authService: AuthService,
    private _userService: UserService,
    private _ticketService: TicketService,
    private _event: Events
  ) {
  }

  ionViewDidLoad() {
    this.checkPriority = this._authService.getPriority();
    this.macro = this.navParams.get('data');
    console.log(this.macro);
    this.initDetail();
  }
  initDetail(){
    this.action = JSON.parse(this.macro.action);
    for(let i = 0; i < this.action.length;i++){
      switch(this.action[i]['type']){
        case 'priority': 
          this.dataMacro.priority = this.action[i]['value'];
          this.priority = this.checkPriority[this.action[i]['value']-1];
          this.arrCheck.push({type:'priority'}); 
          break;
        case 'status': 
          this.dataMacro.status = this.action[i]['value'];
          this.status = this.checkStatus[this.action[i]['value']];
          this.arrCheck.push({type:'status'}); 
          break;
        case 'public_reply': 
          this.dataMacro.content = this.action[i]['value']; 
          this.dataMacro.private = 0; 
          this.arrCheck.push({type:'content'}); 
          break;
        case 'private_reply':
          this.dataMacro.content = this.action[i]['value']; 
          this.dataMacro.private = 1; 
          this.arrCheck.push({type:'content'});  
          break; 
        case 'assign_agent':
          this.dataMacro.assign_agent = this.action[i]['value'];
          this.arrCheck.push({type:'assign_agent'});
          this._userService.getUserName(this.action[i]['value']).subscribe(res=>{
            this.assignName = res.name;
          })
          break;
        case 'assign_team':
          this.dataMacro.assign_team = this.action[i]['value'];
          this.arrCheck.push({type:'assign_team'});
          this._userService.getUserInTeam(this.action[i]['value']).subscribe(res=>{
            this.teamName = res.info.team_name;
          })
          break;
        case 'assignee':
          let value = this.action[i]['value'];
          value = value.split('_');
          this.dataMacro.assign_team = value[0];
          this.arrCheck.push({type:'assign_team'});
          this._userService.getUserInTeam(value[0]).subscribe(res=>{
            this.teamName = res.info.team_name;
          })
          if(value[1]!='0'){
            this.dataMacro.assign_agent = value[1];
            this.arrCheck.push({type:'assign_agent'});
            this._userService.getUserName(value[1]).subscribe(res=>{
              this.assignName = res.name;
            })
          }
          break;
        case 'category':
          let categoryName = '';
          this._ticketService.getCategoryName2(this.action[i]['value']).subscribe(res=>{
            this.category = res.name2;
            this.arrCheck.push({type:'category'});
            this.dataMacro.category = this.action[i]['value'];
            this.dataMacro.parent2 = res.parent2;
            for(let i = 0; i< res.name2.length;i++){
              categoryName += res.name2[i]['name']+ " / ";
            }
            this.dataMacro.categoryName = categoryName;
          })
          break;
      }
    }
    console.log(this.dataMacro);
  }
  actionDetail(){
    this._event.publish('MACRO',{dataMacro:this.dataMacro,assignName:this.assignName,teamName: this.teamName});
    this.navCtrl.popAll();
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }
}
