import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs/Rx";
import { Injectable } from '@angular/core';

@Injectable()
export class MyCanActivateGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    console.log(route);
    console.log(state);
    // check token from local Storage
    var token = localStorage.getItem("token");
    if (!token) {
       var result = confirm('Are you sure you have logged in?');
       this.router.navigate(['error']);
    }

    return true;
  }
}
