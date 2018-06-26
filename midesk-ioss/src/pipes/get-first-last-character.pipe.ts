import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'firstNlast',
    pure: false
})

export class GetFirstLastCharacter implements PipeTransform {
    transform(val:string) {
    //return val.charAt(0);
    if(val.indexOf(' ') >= 0){
        let tmp = val.split(' ');
        if(tmp.length>1){
            //return tmp[0].charAt(0)+' '+tmp[tmp.length-1].charAt(0);
            return tmp[0].charAt(0)+' '+tmp[1].charAt(0);
        }else{
            return tmp[0].charAt(0);
        }
    }
    else return val.charAt(0);
    
  }
}