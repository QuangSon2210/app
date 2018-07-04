import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthService } from './../../../services/authentication/auth.service';

/**
 * Generated class for the PopoverStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  template: `
  	<ion-list radio-group class="popover-page">
      <ion-row>
        <ion-col>
          <ion-item no-padding *ngFor="let item of priority">
            <ion-label><ion-badge [ngStyle]="{'background-color':item.color}" >{{item.name}}</ion-badge></ion-label>
            <ion-radio (click)="choosePriority(item)" [checked]="item.id==selectedId"></ion-radio>
          </ion-item>  
        </ion-col>
      </ion-row>
    </ion-list>
  `,
  selector: 'page-popover-priority',
})
export class PopoverPriority {
  priority:any;
  selected_priority={
    id:0,
    name:'',
    sort:'',
    color:'',
  };
  selectedId:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    _authService: AuthService, 
    private viewCtrl: ViewController
    ) {
  	this.priority = _authService.getPriority();
    this.selectedId = navParams.get('data');
    console.log(this.selectedId);
  }
  choosePriority(index){
    this.selected_priority = index;
    this.viewCtrl.dismiss({priority:this.selected_priority});
  }
}
