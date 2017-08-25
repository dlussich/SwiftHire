import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'waitpipe', pure: false
})

// check if myId is in this job's waitList
export class WaitPipe implements PipeTransform {

  transform(items: any, field?: any): any {
    if (!items) return [];

    // try to get my userId from localstorage.
    let myId = localStorage.getItem("userId");
    return items.filter(i => {
      if (i.waitingList) {
        if (i.waitingList.filter(u => u._id == myId).length > 0) {
          return true;
        }
      }
      return false;
    });
  }

}
