import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { WindowRef } from '../WindowRef';
import { JobService } from "app/service/job.service";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";


@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  searched:boolean;
  jobs;
  closeJobs;
  searchedJobs;
  searchForm: FormGroup;
  selectedData;
  categoryList;
  message;
  constructor(private jobService:JobService, private window: WindowRef, private fb: FormBuilder) {
   this.searched=false;
   this.searchForm=fb.group({
          'filter':['',Validators.required],
          'dropList':[''],
          'search':['']
   });
   this.window.nativeWindow.navigator.geolocation.getCurrentPosition(success=>{
        let lat=success.coords.latitude;
        let long=success.coords.longitude;
        this.jobService.getAllNearJobs(lat,long).subscribe(resp=>{
          console.log(resp);
          this.closeJobs=resp;
        },
         error=>{
              alert('Your browser does not allow geolocation');
        });
          });
    
      this.categoryList=jobService.categories;
   }
   
  ngOnInit() {
  }

  onSearch(){
    this.searched=true;
    let value;
    if(this.searchForm.controls['filter'].value=='fee'){
      value=this.searchForm.controls['search'].value;
      console.log('Search: '+value);
      this.jobService.getJobByFee(value).subscribe(res=>{
        this.searchedJobs=res.json();
      });

    }else{
        if(this.searchForm.controls['filter'].value=='category'){
              value=this.searchForm.controls['dropList'].value;
              this.jobService.getJobByCategory(value).subscribe(res=>{
                  this.searchedJobs=res.json();
              });
        }else{
           this.window.nativeWindow.navigator.geolocation.getCurrentPosition(success=>{
                let lat=success.coords.latitude;
                let long=success.coords.longitude;
                this.jobService.getAllNearJobs(lat,long).subscribe(resp=>{
                      this.searchedJobs=resp;
                },
                error=>{
                      alert('Your browser does not allow geolocation');
                  });
            });
        }
            
    }
    
  }

  fieldsValidator(): {[s: string]: boolean}{
      if(this.searchForm.controls['dropList'].value !== ' '|| this.searchForm.controls['search'].value!==' '){
        return null;
      }
      return {property:false};
  }

}
