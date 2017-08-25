import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chosenpipe', pure: false
})
export class ChosenPipe implements PipeTransform {

  transform(items: any, field?: any): any {
    if (!items) return [];

    return items.filter(i => i.candidate);
  }

}
