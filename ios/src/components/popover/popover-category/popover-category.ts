import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';
import { TicketService } from './../../../services/ticket.service';


@Component({
  template: `
    <ion-header style="border-bottom:0.55px solid #CCC">
        <ion-navbar class="navbar-category">
          <ion-grid no-padding>
            <ion-row no-padding>
              <ion-col col-1>
                <ion-buttons *ngIf="filterCategory.dataChoose.length>0" (click)="chooseCategory(item,$type='back')"><button ion-button><ion-icon color="dark" name="arrow-back"></ion-icon></button></ion-buttons>
              </ion-col>
              <ion-col col-11>
                <ion-input type="text" placeholder="Nhập tên chủ đề" [(ngModel)]="searchText"></ion-input>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-navbar>
    </ion-header>
    <ion-content>
      <ion-spinner padding margin *ngIf="loading" name="crescent"></ion-spinner>
      <ion-list inset *ngIf="!loading" >
        <ion-item *ngFor="let item of filterCategory.dataItems | filter:searchText" (click)="chooseCategory(item,$type='choose')">
        {{item.name}}
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-footer style="position:fixed;" no-lines>
      <ion-navbar  class="navbar-category">
        <ion-buttons end><button ion-button color="dark" *ngIf="filterCategory.dataChoose.length>0" (click)="doCategory()">Xác nhận</button></ion-buttons>
        <ion-buttons end><button ion-button color="dark" (click)="close()">Đóng</button></ion-buttons>
      </ion-navbar>
    </ion-footer>
  `,
  selector:'popover-category',
})

export class PopoverCategory {
  filterCategory={
    dataItems:[],
    dataChoose:[],
    selected:0,
    loadMore:false,
    cateId:0,
    parentId:0
  }
  searchText:any;
  loading = false;
  constructor(public viewCtrl: ViewController,public navParams:NavParams,private _ticketService : TicketService) {
    this.loading = true;
    this._ticketService.getTicketCategory(this.filterCategory.parentId).subscribe(res=>{
      this.filterCategory.dataItems=res.data;
      this.loading=false;
    });
  }
  close() {
    this.viewCtrl.dismiss();
  }
  chooseCategory(index,$type){
    if($type=='back'){
      this.loading = true;
      this.filterCategory.dataChoose.pop();
      this._ticketService.getTicketCategory(this.filterCategory.parentId).subscribe(res=>{
        this.filterCategory.dataItems = res.data;
        this.filterCategory.parentId = res.lastId;
        console.log(this.filterCategory.dataChoose);
        this.loading = false;
      })
    }
    else{
      this.loading = true;
      this.filterCategory.dataChoose.push(index);
      this._ticketService.getTicketCategory(index.id).subscribe(res=>{
        if(res.data.length>0){
          this.filterCategory.dataItems = res.data;
          this.loading = false;
        }
        else{
          this.loading = false;
          this.doCategory();
          console.log(this.filterCategory.dataChoose);
        }
        this.filterCategory.parentId = res.lastId;
      });
    }
  }
  doCategory(){
    let data = this.filterCategory.dataChoose;
    this.viewCtrl.dismiss(data);
  }
}