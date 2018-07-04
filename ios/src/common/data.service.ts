import { AlertController, ToastController, LoadingController, Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class DataService {
    constructor(
        public alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        private _event: Events,
    ) {}
    createAlertWithHandle(msgContent:string){
        var alert = this.alertCtrl.create({
            message: msgContent,
            buttons:[
                {
                    text: 'Hủy',
                    handler: () => {
                       alert.dismiss(false);
                       return false;
                    }
                },
                {
                    text: 'Đồng ý',
                    handler: () => {
                        alert.dismiss(true);
                        return false;
                    }
                }
            ]
        })
        return alert;
    }
    createAlertWithoutHandle(msgContent:string){
        let alert = this.alertCtrl.create({
            message: msgContent,
            buttons: [{text: 'Đóng'}]
        })
        alert.present();
    }
    listenEvent(eventName,handle?){
        let observable = new Observable(observer=>{
            this._event.subscribe(eventName,(data)=>{
                observer.next(data);
            });
        })
        return observable;
    }
    publishEvent(eventName,data?){
        this._event.publish(eventName,data);
    }
    createLoading(option?){
        let loader = this.loadingCtrl.create(option);
        return loader;
    }
    createToast(msgContent?,duration?,cssClass?){
        let toast = this.toastCtrl.create({
            message:msgContent,
            position:'bottom',
            duration:duration,
            cssClass:cssClass,
        });
        toast.present();
    }
    createToastWithHandle(msgContent?,duration?,cssClass?,showCloseButton?,closeButtonText?){
        let toast = this.toastCtrl.create({
            message:msgContent,
            position:'bottom',
            duration:duration,
            cssClass:cssClass,
            showCloseButton:showCloseButton,
            closeButtonText:closeButtonText
        });
        toast.onDidDismiss(()=>{
            window.location.reload();
        })
        toast.present();
    }
}