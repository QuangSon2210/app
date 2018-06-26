import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';


@Component({
  template: `
    <ion-list radio-group class="popover-page">
      <ion-row>
        <ion-col>
          <ion-label padding-left>Trạng thái</ion-label>
          <ion-item no-padding *ngFor="let item of status">
            <ion-label><ion-badge color="{{item.value}}">{{item.alias}}</ion-badge><span style="padding-left:5px;font-size:1.3rem">{{item.name}}</span></ion-label>
            <ion-checkbox (ionChange)="item.checked=!item.checked" [checked]="item.checked"></ion-checkbox>
          </ion-item>  
        </ion-col>
        <ion-col>
          <ion-label padding-left>Độ ưu tiên</ion-label>
          <ion-item no-padding *ngFor=" let item of priority; let i = index">
            <ion-label><ion-badge [ngStyle]="{'background-color':item.color}" >{{item.name}}</ion-badge></ion-label>
            <ion-checkbox (ionChange)="item.checked=!item.checked" [checked]="item.checked" ></ion-checkbox>
          </ion-item> 
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-label padding-left>Sắp xếp theo:</ion-label>
          <ion-item *ngFor="let item of orderBy; let i = index">
            <ion-label>{{item.name}}</ion-label>
            <ion-radio (ionSelect)="changeSort(item)" [checked]="item.checked"></ion-radio>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-6 padding-left><button class="button-popover" ion-button block color="secondary" (click)="confirmSort()">Xác nhận</button></ion-col>
        <ion-col col-6 padding-right><button class="button-popover" ion-button block color="solved" (click)="close()" >Hủy</button></ion-col>
      </ion-row>
    </ion-list>
  `,
  selector:'popover-sort',
})
export class PopoverSort {
  priority=[];
  status=[];
  orderBy=[];
  checkedPriority=[];
  checkedItems={
    status:'',
    priority:'',
    orderBy:'',
  };
  constructor(public viewCtrl: ViewController,public navParams:NavParams) {
    this.priority=this.navParams.data.priority;
    this.status=this.navParams.data.status;
    this.orderBy = this.navParams.data.orderBy;
    //this.checkedItems = new Array(this.priority.length);
  }
  close() {
    this.viewCtrl.dismiss();
  }
  changeSort(index){
    this.checkedItems.orderBy=index.value;
    for(let i = 0; i < this.orderBy.length; i++){
      if(this.orderBy[i].value == index.value){
        this.orderBy[i].checked = true;
      }
      else{
        this.orderBy[i].checked = false;
      }
    }
  }
  confirmSort(){
    // this.checkedItems={
    //   status:'',
    //   priority:'',
    //   orderBy:'',
    // };
    //console.log(this.priority);
    for(let i = 0;i<this.status.length;i++){
      if(this.status[i].checked == true){
        this.checkedItems.status+="'"+this.status[i].value+"'"+',';
      }
    }
    for(let i = 0;i<this.priority.length;i++){
      if(this.priority[i].checked == true){
        this.checkedItems.priority+=this.priority[i].id+',';
      }
    }
    if(this.checkedItems.priority!=='') this.checkedItems.priority = this.checkedItems.priority.slice(0,-1);
    if(this.checkedItems.status!=='') this.checkedItems.status = this.checkedItems.status.slice(0,-1);
    this.viewCtrl.dismiss(this.checkedItems);
  }
}
