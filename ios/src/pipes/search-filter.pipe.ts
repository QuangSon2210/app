import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})

export class SearchFilter implements PipeTransform {
    transform(items: any[], str:string): any {
    	if(!items||!str){
    		return items;
    	}
        return items.filter(item => item.name.toLowerCase().indexOf(str.toLowerCase()) !== -1);
    }
}