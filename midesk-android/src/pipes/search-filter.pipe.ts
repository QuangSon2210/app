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
    // }
    // transform(value: any, args: any[] = null): any {
    //     return Object.keys(value)//.map(key => value[key]);
    // }
    //fullTextSearch:query:'name'
    // transform(value: any, query: string, field: string): any {
    //   return query ? value.reduce((prev, next) => {
    //     if (next[field].includes(query)) { prev.push(next); }
    //     return prev;
    //   }, []) : value;
    // }
}