import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'charAt',
    pure: false
})

export class GetFirstCharacter implements PipeTransform {
    transform(val:string) {
    return val.charAt(0);
    // let tmp = val.split(' ');
    // if(tmp.length>1){
    //     return tmp[0].charAt(0)+' '+tmp[tmp.length-1].charAt(0);
    // }else{
    //     return tmp[0].charAt(0);
    // }
    
  }
}