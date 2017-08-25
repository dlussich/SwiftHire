/**
 * Created by Samuel on 18/7/2017.
 */
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JobService } from '../service/job.service';
import { Subscription } from "rxjs/Rx";

@Component({
  selector: 'candidate-list',
  template:`    
    <div *ngFor="let candidate of candidates" class="col-md-8">
      <candidate-item [item]="candidate" [jobId]="jobId" class="row"></candidate-item>
    </div>
    <br>
    <router-outlet></router-outlet>
  `,
  providers:[]
})

export class CandidatesComponent implements OnInit,OnDestroy {
  @Input() candidates:any;
  @Input() jobId:string;

  private subscription: Subscription;

  constructor(private jobService: JobService, private activatedRoute: ActivatedRoute) {
    this.subscription = activatedRoute.queryParams.subscribe(
      (param: any) => {
        this.jobId = param['jobId'];
        this.subscription = this.jobService.getCandidateList(this.jobId).subscribe(resp=>{
            //console.log(resp);
            if(resp && resp.json() && resp.json().waitingList) {
              this.candidates = resp.json().waitingList;
            } else {
              this.candidates = [];
            }
          },
          error=>{
            console.log('This doesnt work');
          },()=>{});
      }
    );
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
