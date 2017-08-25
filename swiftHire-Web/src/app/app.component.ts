import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  tempObj: any;

  constructor(private router: Router) {
    this.tempObj = {"_id":"1","name":"Wash car","description":"Wash my neigbours Ferrari","category":"Wash","location":{"type":"Point", "coordinates":[-91.96811168,41.00800002]},"duration":"2","hourFee":"8","preferDate":"7/18/2017","preferTime":"3:00 pm","candidate":"","available":"true","waitingList":[],"owner":"1"};

  }

  onTabClick(path: string) {
    //this.rout
  }

}
