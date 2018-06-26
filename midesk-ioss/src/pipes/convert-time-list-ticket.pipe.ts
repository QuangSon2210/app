import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'toTime2',
    pure: false
})

export class ConvertTimeListTicket implements PipeTransform {
    transform(val:any) {
        if(typeof val == 'string'){
            val = Date.parse(val)/1000;
        }
        var tmp =  new Date().toString();
        var now = Date.parse(tmp)/1000;
        var compare = now - val;
        if(compare < 60){
            val = "now";
        }
        else if(compare <= 3600){
            val = Math.round(compare/60)+"m ago";
        }
        else if(compare > 3600 && compare < 86400){
            val = Math.round(compare/3600)+"h ago";
        }
        else{
            let time = new Date(val*1000);
            let day = (time.getDate()<10)?'0'+time.getDate():time.getDate();
            let month = (time.getMonth()+1<10)?'0'+(time.getMonth()+1):time.getMonth()+1;
            val = day+'/'+month;
        }
        return val;
  }
}