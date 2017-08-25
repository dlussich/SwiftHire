// components/toolbar.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'toolbar',
  template: `
    <div class="toolbar">
      <button class="glyphicon glyphicon-log-in" style="margin-top:10px; padding-top:5px; padding-bottom:5px;" (click)="auth.login()" *ngIf="!auth.loggedIn()">
        Login
      </button>
      <button class="glyphicon glyphicon-log-out" style="margin-top:10px; padding-top:5px; padding-bottom:5px;" (click)="auth.logout()" *ngIf="auth.loggedIn()">
        Logout
      </button>
    </div>
  `,
  providers:[AuthService]
})
export class ToolbarComponent {
  constructor(private auth: AuthService) {}
  login() {
    this.auth.login();
  }
  logout() {
    this.auth.logout();
  }
}