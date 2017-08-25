import { Component, OnInit, Inject,OnDestroy } from '@angular/core';
import { JobService } from "app/service/job.service";
import { Subscription } from "rxjs/Rx";

@Component({
  selector: 'jobs-enrolled',
  template: `
    <div class="container">
        <h1 align="center">Enrolled Jobs</h1>
        <table class="table">
          <tr class="row">
            <th>Tittle</th>
            <th>Hours</th>
            <th>Payment Fee</th>
            <th>Date</th>
            <th>Time</th>
            <th></th>
          </tr>
          
          <tr class="row" *ngFor="let j of jobs | chosenpipe">
            <td>{{j.name}}</td>
            <td>{{j.duration}}</td>
            <td>{{j.hourFee}}</td>
            <td>{{j.preferDate | date:"MM-dd-yyyy"}}</td>
            <td>{{j.preferTime}}</td>
            <td><a class="btn btn-primary" (click)="selectedData=j;hideFlag=false;">Details</a></td>
            <td *ngIf="checkIfJobStart()"><a [routerLink]="['addcomment']" [queryParams]="{jobId: j._id}" (click)="onBtnClick()" class="btn btn-primary">Add Comment</a></td>
          </tr>

          <tr class="row" *ngFor="let j of jobs | waitpipe">
            <td>{{j.name}}</td>
            <td>{{j.duration}}</td>
            <td>{{j.hourFee}}</td>
            <td>{{j.preferDate | date:"MM-dd-yyyy" }}</td>
            <td>{{j.preferTime}}</td>
            <td><a class="btn btn-primary" (click)="selectedData=j">Details</a></td>
          </tr>
        </table>
    </div>

    <job_detail *ngIf="selectedData  && !hideFlag" [data]="selectedData" ></job_detail>
    <router-outlet *ngIf="hideFlag"></router-outlet>
    
  `
})

export class JobsEnrolledComponent implements OnInit,OnDestroy {
  jobs: any;
  selectedData;
  hideFlag:boolean;
  private subscription: Subscription;

  onBtnClick() {
    this.hideFlag = true;
  }

  constructor(private jobService:JobService) {}

  ngOnInit() {
    // try to get my userId from localstorage.
    let myId = localStorage.getItem("userId");
    this.subscription = this.jobService.getJobsEnrolled(myId).subscribe(resp=>{
        //console.log(resp);
        this.jobs = resp.json();
        console.log("Samuel Test get enrolled this.jobs = " + this.jobs);
      },
      error=>{
        console.log('This doesnt work');
      },()=>{});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  checkIfJobStart() {
    return true;
  }

}
