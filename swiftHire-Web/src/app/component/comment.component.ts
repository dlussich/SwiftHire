/**
 * Created by Samuel on 13/7/2017.
 */
import { Component, OnInit, Output, Input } from '@angular/core';

@Component({
  selector: 'comment',
  template:`  
    <div>
      <span class="col-md-6">{{item.content}}</span>
      <span class="col-md-4">{{item.date }}</span>
      <span>{{item.rate}}</span>
      <span>{{item.jobOwner}}</span>
    </div>
  `,
  providers:[]
})


export class CommentComponent implements OnInit {
  @Input() item:any;
  invalidate:boolean;

  constructor() {
    this.invalidate = false;
  }

  ngOnInit() {

  }
}
