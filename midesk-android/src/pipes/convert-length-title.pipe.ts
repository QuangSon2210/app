import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'convertLength',
    pure: false
})

export class ConvertLengthTitle implements PipeTransform {
    transform(val:string) {
    	// if(val.lastIndexOf(' ') >20){
    	// 	var tmp = val.split(' ',4);
    	// 	var str = tmp[0]+' '+tmp[1]+' '+tmp[2]+' '+tmp[3]+'...';
    	// 	return str;
    	// }
    	if(val.length>17){
    		var tmp = val.substr(0,15)+'...';
    		return tmp;
    	}
    	else return val;
  }
}