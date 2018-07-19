import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'convertLength',
    pure: false
})

export class ConvertLengthTitle implements PipeTransform {
    transform(val:string) {
    	if(val.length>17){
    		var tmp = val.substr(0,15)+'...';
    		return tmp;
    	}
    	else return val;
  }
}