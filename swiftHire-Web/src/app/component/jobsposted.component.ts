import { Component, OnInit, Inject,OnDestroy } from '@angular/core';
import { JobService } from "app/service/job.service";
import { Subscription } from "rxjs/Rx";

@Component({
  selector: 'jobs-posted',
  template: `
    <div class="container">
        <h1 align="center">Posted Jobs</h1>
        <table class="table">
          <tr class="row">
            <th>Tittle</th>
            <th>Hours</th>
            <th>Payment Fee</th>
            <th>Date</th>
            <th>Time</th>
            <th></th>
            <th></th>
          </tr>
          <tr class="row" *ngFor="let j of jobs">
            <td>{{j.name}}</td>
            <td>{{j.duration}}</td>
            <td>{{j.hourFee}}</td>
            <td>{{j.preferDate | date:"MM-dd-yyyy"}}</td>
            <td>{{j.preferTime}}</td>
            <td><a class="btn btn-primary" (click)="selectedData=j;hideFlag=false;">Details</a></td>
            <td *ngIf="j.waitingList.length > 0" ><a [routerLink]="['candidates']" [queryParams]="{jobId: j._id}" class="btn btn-primary" (click)="onBtnClick()">Candidates</a></td>

            <td *ngIf="j.candidate" ><a [routerLink]="['addcomment']" [queryParams]="{jobId: j._id}" (click)="onBtnClick()" class="btn btn-primary">Add Comment</a></td>
          </tr>
        </table>
        <job_detail *ngIf="selectedData  && !hideFlag" [data]="selectedData" ></job_detail>
        <router-outlet *ngIf="hideFlag"></router-outlet>
    </div>
  `
})

export class JobsPostedComponent implements OnInit,OnDestroy {
  jobs: any;
  selectedData;
  hideFlag:boolean;
  private subscription: Subscription;

  constructor(private jobService:JobService) {}

  onBtnClick() {
    this.hideFlag = true;
  }

  ngOnInit() {
    // try to get my userId from localstorage.
    let myId = localStorage.getItem("userId");
    this.subscription = this.jobService.getJobsPosted(myId).subscribe(resp=>{
        //console.log(resp);
        this.jobs=resp.json();
      },
      error=>{
        console.log('This doesnt work');
      },()=>{});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
