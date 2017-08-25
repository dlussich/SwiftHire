import { Component, OnInit, Inject,OnDestroy,Input } from '@angular/core';
import { JobService } from "app/service/job.service";
import { UserService } from "app/service/user.service";
import { Subscription } from "rxjs/Rx";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { WindowRef } from '../WindowRef';

@Component({
  selector: 'createjob',
  templateUrl:`./createjob.component.html`,
  providers:[]
})

export class CreateJobComponent implements OnDestroy {
   private subscription: Subscription;
   myForm: FormGroup;
   //jobId:string;
   // @Input() jobObj:any;

  constructor(private userService: UserService, private jobService: JobService, private formBuilder: FormBuilder, private window: WindowRef,private router:Router) {

    let myId = localStorage.getItem("userId");

    this.myForm = this.formBuilder.group({
      'name': ['', [Validators.required]],
      'description': ['', [Validators.required]],
      'categories': ['', [Validators.required]],
      'duration': ['', [Validators.required]],
      'hourFee': ['', [Validators.required]],
      'preferDate': ['', [Validators.required]],
      'preferTime': ['', [Validators.required]],
      'lat':[''],
      'long':['']
    });

  }

  ngOnInit() {}

  onSubmit() {
    let myId = localStorage.getItem("userId");
    var name = this.myForm.controls['name'].value;
    var description = this.myForm.controls['description'].value;
    var category = this.myForm.controls['categories'].value;
    var duration = this.myForm.controls['duration'].value;
    var hourFee = this.myForm.controls['hourFee'].value;
    var preferDate = this.myForm.controls['preferDate'].value;
    var preferTime = this.myForm.controls['preferTime'].value;

    this.window.nativeWindow.navigator.geolocation.getCurrentPosition(success=>{
        let lat=success.coords.latitude;
        let long=success.coords.longitude;
        let obj={"name":name,
          "description":description,
          "category":category,
          "duration":duration,
          "hourFee":hourFee,
          "lat":lat,
          "long":long,
          "preferDate":preferDate,
          "preferTime":preferTime,
          "owner":myId,
          "available":true};
        this.jobService.postOneJob(obj).subscribe(success=>{
          this.myForm.reset();
          alert('Your job was successfully posted!');
          this.router.navigate(['jobs/posted']);
        },
        error=>{
            alert('It was not possible to post the job, an error happend');
        });
    });
  }

  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }
}
