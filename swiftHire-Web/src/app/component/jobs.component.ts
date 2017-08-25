import { Component, OnInit, Inject } from '@angular/core';
import { WindowRef } from '../WindowRef';
import { JobService } from "app/service/job.service";


@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  jobs;
  constructor(private jobService:JobService, private window: WindowRef) {
   //this.window.nativeWindow.getPosition();
   this.window.nativeWindow.navigator.geolocation.getCurrentPosition(success=>{
        let lat=success.coords.latitude;
        let long=success.coords.longitude;
        this.jobService.getAllNearJobs(lat,long).subscribe(resp=>{  
          console.log(resp);                  
          this.jobs=resp;
        },
         error=>{
              console.log('This shit doesnt work');
        });},
        error=>{
              alert('We are sorry your browser does not support geolocation detection');
          });
   }

   

  ngOnInit() {
  }



}
