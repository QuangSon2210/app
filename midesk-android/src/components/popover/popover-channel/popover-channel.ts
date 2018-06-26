import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';


@Component({
  template: `
    <ion-list radio-group class="popover-page">
      <ion-row>
        <ion-col>
          <ion-label padding-left>Kênh</ion-label>
          <ion-list class="list-channel" radio-group [(ngModel)]="channel">
          <ion-item no-padding>
            <ion-label><ion-icon color="allchanel" name="aperture"></ion-icon><span style="padding-left:5px;padding-bottom:10px;font-size:1.4rem">Tất cả</span></ion-label>
            <ion-radio value="all"></ion-radio>
          </ion-item>
          <ion-item no-padding>
            <ion-label><ion-icon color="facebook" name="logo-facebook"></ion-icon><span style="padding-left:5px;font-size:1.4rem">Facebook</span></ion-label>
            <ion-radio value="facebook"></ion-radio>
          </ion-item> 
          <ion-item no-padding>
            <ion-label><ion-icon color="chrome" name="logo-chrome"></ion-icon><span style="padding-left:5px;font-size:1.4rem">Web</span></ion-label>
            <ion-radio value="web"></ion-radio>
          </ion-item> 
          <ion-item no-padding>
            <ion-label><ion-icon color="primary" name="chatbubbles"></ion-icon><span style="padding-left:5px;font-size:1.4rem">Chat</span></ion-label>
            <ion-radio value="chat"></ion-radio>
          </ion-item>
          <ion-item no-padding>
            <ion-label><ion-icon color="secondary" name="call"></ion-icon><span style="padding-left:5px;font-size:1.4rem">Voice</span></ion-label>
            <ion-radio value="voice"></ion-radio>
          </ion-item>
          </ion-list>   
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-6 padding-left><button class="button-popover" ion-button block color="secondary" (click)="confirmSort()">Xác nhận</button></ion-col>
        <ion-col col-6 padding-right><button class="button-popover" ion-button block color="solved" (click)="close()" >Hủy</button></ion-col>
      </ion-row>
    </ion-list>
  `,
  selector:'popover-channel',
})
export class PopoverChannel {
  channel='';
  constructor(public viewCtrl: ViewController,public navParams:NavParams) {
    //this.checkedItems = new Array(this.priority.length);
    this.channel=(this.navParams.get('data'));
  }
  close() {
    this.viewCtrl.dismiss();
  }
  confirmSort(){
    this.viewCtrl.dismiss({channel:this.channel});
  }
}