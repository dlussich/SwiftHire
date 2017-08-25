/**
 * Created by Samuel on 18/7/2017.
 */
import { Component, OnInit, Inject,OnDestroy,Input } from '@angular/core';
import { JobService } from "app/service/job.service";
import { UserService } from "app/service/user.service";
import { Subscription } from "rxjs/Rx";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ratecomment',
  templateUrl:`./ratecomment.component.html`,
  providers:[]
})

export class RateCommentComponent implements OnDestroy {
  private subscription: Subscription;
  myForm: FormGroup;
  jobId:string;
  @Input() jobObj:any;

  constructor(private userService: UserService,private jobService: JobService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute) {
    this.subscription = activatedRoute.queryParams.subscribe(
      (param: any) => {
        this.jobId = param['jobId'];
        this.subscription = this.jobService.getCandidateList(this.jobId).subscribe(resp=>{
            //console.log(resp);
            if(resp && resp.json()) {
              this.jobObj = resp.json();
            } else {
              this.jobObj = {};
            }
          },
          error=>{
            console.log('This doesnt work');
          },()=>{});
      }
    );
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      'rate': [''],
      'content': ['', [Validators.required]]
    });
  }

  onSubmit() {
    var mydate = new Date();
    var curr_date = mydate.getDate();
    var curr_month = mydate.getMonth();
    var curr_year = mydate.getFullYear();
    var date = curr_month + "/" + curr_date + "/" + curr_year;

    var rate = this.myForm.controls['rate'].value;
    var content = this.myForm.controls['content'].value;
    var jobId = this.jobId;

    this.userService.getUserDetail(this.jobObj.owner).subscribe(resp => {
        let jobOwner = resp.json().name;
        this.subscription = this.userService.addCommentForOwner(content, date, rate, jobId, jobOwner,this.jobObj.owner).subscribe(resp=>{
            alert("Add one comment for this worker successfully");
            this.myForm.reset();
          },
          error=>{
            console.log('This doesnt work');
          },()=>{});
      },
      error=>{
        console.log('This doesnt work');
      },()=>{});

    console.log(this.myForm.value);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
