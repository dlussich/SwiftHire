import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { AppConfig } from '../AppConfig';

@Injectable()
export class UserService {

  constructor(public http:HttpService) { }

  getAllUsers() {
    return this.http.get(AppConfig.BASE_URL + "users/");
  }

  postUserDetail(userId: string) {
    return this.http.get(AppConfig.BASE_URL + "users/" + userId);
  }

  /**
   * Get User(worker or job owner) detail information
   * @param userId
   * @returns {Observable<Response>}
   */
  getUserDetail(userId: string) {
    return this.http.get(AppConfig.BASE_URL + "users/" + userId);
  }

  /**
   * Add comment for Owner
   * @returns {Observable<Response>}
   */
  addCommentForOwner(content:string, date:string, rate:string, jobId:string, jobOwner:string, jobOwnerId:string) {
    return this.http.post(AppConfig.BASE_URL + "users/", {
      "content": content,
      "date": date,
      "rate": rate,
      "jobOwner": jobOwner,
      "jobId": jobId,
      "jobOwnerId":jobOwnerId
    });
  }


  /**
   * Update or insert one user
   * @returns {Observable<Response>}
   */
  upsertOneUser(name:string, avatar:string, _id:string) {
    let obj = {
      "_id":_id,
      "name":name,
      "avatar":avatar
    }

    return this.http.post(AppConfig.BASE_URL + "users/upsert", obj);
  }
}
