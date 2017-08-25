// services/auth.service.ts
import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';
import { UserService } from './user.service';

// We want to avoid any 'name not found'
// warnings from TypeScript
declare var Auth0Lock: any;

@Injectable()
export class AuthService {

  lock = new Auth0Lock('wPOJ2LiGIJgiiuqWnirTs2IIMd2q7Te9', 'swift-hire.auth0.com');

  constructor(private router: Router, private userService:UserService) {
    this.lock.on("loggedIn",result => {

    });
 }

 login() {
   this.lock.show((error: string, profile: Object, id_token: string) => {
     if (error) {
       console.log(error);
     }
     // We get a profile object for the user from Auth0
     localStorage.setItem('profile', JSON.stringify(profile));

     /**
      * {
      * "email":"leangchandara@gmail.com",
      * "email_verified":true,
      * "user_id":"auth0|596d20776a035b657c719d47",
      * "clientID":"wPOJ2LiGIJgiiuqWnirTs2IIMd2q7Te9",
      * "picture":"https://s.gravatar.com/avatar/ceea6e7f936771e32f6bedfc7f82999a?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fle.png",
      * "nickname":"leangchandara",
      * "identities":[{"user_id":"596d20776a035b657c719d47","provider":"auth0","connection":"Username-Password-Authentication","isSocial":false}],
      * "updated_at":"2017-07-19T23:45:55.309Z","created_at":"2017-07-17T20:39:19.375Z",
      * "name":"leangchandara@gmail.com","last_password_reset":"2017-07-18T17:19:44.282Z",
      * "global_client_id":"SIWH_PHeuykfwdaQ-MxbM8KWYKjAE1uZ"}
      */
     console.log("=========================token");
     //console.log(JSON.stringify(profile));
     // We also get the user's JWT
     localStorage.setItem('token', id_token);
     console.log(id_token);

     // add by xianfeng
     // create or update one User in our database
     let jsonObj = JSON.parse(JSON.stringify(profile));
     let name = jsonObj.name;
     let avatar = jsonObj.picture;
     let _id = jsonObj.identities[0].user_id;
     localStorage.setItem('userId', _id);
     localStorage.setItem('userName', name);

     this.userService.upsertOneUser(name, avatar, _id).subscribe((res) => {
       this.router.navigate(['/jobs']);
     });

   });
 }

 logout() {
    // To log out, we just need to remove
    // the user's profile and token
    localStorage.removeItem('profile');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');

    this.router.navigate(['/error']);
 }

 loggedIn(): boolean {
    return tokenNotExpired();
 }
}
