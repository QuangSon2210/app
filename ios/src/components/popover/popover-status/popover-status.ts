import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

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
          <ion-item no-padding *ngFor="let item of status">
            <ion-label><ion-badge color="{{item.value}}">{{item.alias}}</ion-badge><span style="padding-left:5px;font-size:1.5rem">{{item.name}}</span></ion-label>
            <ion-radio (click)="chooseStatus(item)" [checked]="item.value==selectedId" ></ion-radio>
          </ion-item>  
        </ion-col>
      </ion-row>
    </ion-list>
  `,
  selector: 'page-popover-status',
})
export class PopoverStatus {
  status=[
      { id : 1, name : 'Mở mới', value : 'new', color : '#C8C800', alias: 'n', checked: false  },
      { id : 2, name : 'Đang mở', value : 'open', color : '#C80000', alias: 'o', checked: false },
      { id : 3, name : 'Đang chờ', value : 'pending', color : '#15BDE9', alias: 'p', checked: false },
      { id : 4, name : 'Đã xử lý', value : 'solved', color : '#CCCCCC', alias: 's', checked: false }
  ];
  selected_status={
    id:0,
    name:'',
    value:'',
    color:'',
    alias:'',
  };
  selectedId:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  	this.selectedId = this.navParams.get('data');
  }

  chooseStatus(index){
    this.selected_status = index;
    this.viewCtrl.dismiss({status:this.selected_status});
  }

}
