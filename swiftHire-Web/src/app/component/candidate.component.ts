/**
 * Created by Samuel on 13/7/2017.
 */
import { Component, OnInit, OnDestroy, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../service/user.service';
import { Subscription } from "rxjs/Rx";

@Component({
  selector: 'candidate',
  template:`
    <fieldset>
      <legend>Candidate Details:</legend>
      <div>
        <img [src]="item.avatar" />
        <span>{{item.name}}</span><span>{{item.avergeRate}}</span>
        <button (click)="onPick(item)">Choose</button>
        <br/>
        <div *ngFor="let comment of comments">
          <comment [item]="comment"></comment>
        </div>
      </div>
    </fieldset>
  `,
  providers:[]
})

export class CandidateComponent implements OnDestroy {
  private subscription: Subscription;

  @Input() item:any;
  invalidate:boolean;
  comments: any;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private userService: UserService) {
    this.invalidate = false;

    let temp = {
      "avatar": '',
      "name": 'name',
      "avergeRate": 4.5,
      "comments": []
    };

    this.item = temp;

    this.subscription = activatedRoute.queryParams.subscribe(
      (param: any) => {
        let id = param['id'];
        console.log("------------------- id = " + id);
        this.userService.getUserDetail(id).subscribe(resp=>{
            this.item = resp.json();
            console.log("------------------- id = " + id);
            console.log(this.item);
            this.comments = this.item.comments;
            console.log(this.comments);
          },
          error=>{
            console.log('This doesnt work');
          },()=>{});
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onPick(item: any) {
    var result = confirm("Are you sure choose this candidate to do your job?");
    if (result) {
        // if user choose 'OK'.
        // navigate to home page
        this.router.navigate(['/']);
    }
  }
}
