import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { UserService } from '../../../services/user.service';

/**
 * Generated class for the ModalRequesterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
class Assign {
    public id?: number;
    public name?: string;
    public email?: string;
    public picture?:string;
    public level?:string;
}
@Component({
  selector: 'modal-assign',
  templateUrl: 'modal-assign.html',
})
export class ModalAssign {
  page = 1;
  requesters:Assign[];
  requester:Assign;  
  teams =[];
  members = [];
  selected_team={
    team_id:'',
    team_name:'',
    team_member:'',
  };
  selected_member={
    id:'',
    name:'',
    picture:'',
    level:'',
    phone:'',
    email:'',
  };
  selected_teamId = '';
  selected_memberId = '';
  loading = false;
  modelSearchAssigner = {
    text:'',
    dataItems:[],
  };
  constructor(
  	public navParams: NavParams, 
  	private viewCtrl: ViewController,
  	private _userService: UserService) {
  }
  closeModal(){
      this.viewCtrl.dismiss();
  }
  ionViewWillLoad() {
    let data = this.navParams.get('data');
    console.log(data);
    this.selected_memberId = data.selected_memberId;
    this.selected_teamId = data.selected_teamId;
    this.loading = true;
    this._userService.getListTeam().subscribe(res=>{
        this.teams = res;
        this.loading = false;
    });
  }
  // requesterChange(event: { component: SelectSearchable, value: any }) {
  //       console.log('port:', event.value);
  // }
  // doInfinite(event: { component: SelectSearchable, infiniteScroll: InfiniteScroll }){
  // 	this.page += 1;
  // 	this._userService.getMoreRequester(this.page).subscribe(res=>{
  // 		if(res.data!==null){
  // 			this.requesters.push(...res.data);
  // 		}
  // 		event.infiniteScroll.complete();
  // 	})
  // }
  selectTeam(index){
    this.selected_team= index;
    this.selected_member={
        id:'',
        name:'',
        picture:'',
        level:'',
        phone:'',
        email:'',
    };
    
    if(index.team_member>0){
      this.loading = true;
      this._userService.getUserInTeam(index.team_id).subscribe(res=>{
        if(res.code==200){
        this.members = res.data;
        }
        this.loading = false;
      })
    }else{
      this.selected_teamId = index.id;
      this.selected_memberId = '';
      this.selected_member={
        id:'',
        name:'',
        picture:'',
        level:'',
        phone:'',
        email:'',
      };    
      this.viewCtrl.dismiss({'assign_team':this.selected_team,'assign_agent':this.selected_member});
    }
   
  }
  selectMember(index,$type){
    if($type==='checkMember'){
      this.selected_member = index;
      this.selected_memberId =index.id;
    }
    if($type==='checkTeam'){
      this.selected_teamId = index.id;
      this.selected_memberId = '';
      this.selected_member={
        id:'',
        name:'',
        picture:'',
        level:'',
        phone:'',
        email:'',
      };    
    }
     this.viewCtrl.dismiss({'assign_team':this.selected_team,'assign_agent':this.selected_member});
  }
  clearMember(){
    this.loading = true;
    this.members = [];
    this.selected_teamId = '';
    this.loading = false;
  }
  onSearchAssigner($event){
    this.modelSearchAssigner.dataItems = [];
    if($event.keyCode==13){
      this.loading = true;
      this._userService.searchAssigner(this.modelSearchAssigner).subscribe(res=>{
        this.modelSearchAssigner.dataItems = res;
        this.loading = false;
      })
    }
  }
  clearSearch(){
    this.modelSearchAssigner.dataItems = [];
    this.modelSearchAssigner.text ='';
  }
  onCancel($event){
    this.modelSearchAssigner.dataItems = [];
    this.modelSearchAssigner.text ='';
  }
}
