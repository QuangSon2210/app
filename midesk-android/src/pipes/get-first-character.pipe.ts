import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'charAt',
    pure: false
})

export class GetFirstCharacter implements PipeTransform {
    transform(val:string) {
    return val.charAt(0);
  }
}