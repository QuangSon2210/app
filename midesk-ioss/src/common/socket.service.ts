import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Socket } from 'ng-socket-io';

@Injectable()
export class SocketService {
    constructor(private _socket : Socket) {}
    public statusConnect = false;
    public connect(data:any={}) {
        // ionViewWillLeave() {
        this._socket.connect();
        this._socket.emit('room',data);
    }
    public disconnect() {
        // ionViewWillLeave() {
        this._socket.disconnect();
    }
    public onConnect(){
        this._socket.connect();
    }
    public listenEvent(eventName){
        let observable = new Observable(observer=>{
            this._socket.on(eventName,(data)=>{
                observer.next(data);
            });
        })
        return observable;
    }
    public emitData(name, data : any = {}) {
        this._socket.emit(name, data);
    }
    
    public listEvent(eventName, requiredConnect = true) {
        console.log('--> listen eventName: ', eventName);
        if(requiredConnect && this.statusConnect == false)
            return (new Observable(null));
        let observable = new Observable(observer => {
            this._socket
                .on(eventName, (data) => {
                    observer.next(data);
                });
        })
        return observable;

        //=> Call
        // this.listEvent().subscribe(message => {
        //     return message;
        // });
    }

    public decodeDataFromSocket(data: any = {}) {
        return JSON.parse(decodeURIComponent(window.atob(data)));
    }
}