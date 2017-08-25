import { Injectable, EventEmitter } from '@angular/core';
import { HttpService } from './http.service';
import { AppConfig } from '../AppConfig';
import 'rxjs/add/operator/map';

@Injectable()
export class JobService {
  categories=['Domestic work','Physical work','Other'];
  constructor(public http:HttpService) {}

  getAllNearJobs(lat: number, long: number) {
    return this.http.get(AppConfig.BASE_URL + "jobs/?lat="+lat+"&long="+long)
                    .map(res=>res.json());
  }

   getJobs() {
    return this.http.get(AppConfig.BASE_URL + "jobs/all");
  }

  getJobByCategory(category:string){
    return this.http.get(AppConfig.BASE_URL + "jobs/category/"+category);
  }

  getJobByFee(fee:number){
     return this.http.get(AppConfig.BASE_URL + "jobs/fee/"+fee);
  }

  postOneJob(job:any) {
    return this.http.post(AppConfig.BASE_URL + "jobs/",job);
  }

  /**
   * Function to choose one candidate
   * @param candidateId
   * @param jobId
   * @returns {Observable<Response>}
   */
  pickCandidateForJob(candidateId:string, jobId:string) {
    let body = {
      "candidateId":candidateId,
      "jobId":jobId
    }
    return this.http.post(AppConfig.BASE_URL + "jobs/choose", body);
  }

  /**
   * Function to apply one job
   * @param candidateId
   * @param jobId
   * @returns {Observable<Response>}
   */
  applyOneJob(candidateId:string, jobId:string) {
    let body = {
      "candidateId":candidateId,
      "jobId":jobId
    }
    return this.http.post(AppConfig.BASE_URL + "jobs/apply", body);
  }

  /**
   * Function to get all posted jobs by userId
   * @param userId
   * @returns {Observable<Response>}
   */
  getJobsPosted(userId: any) {
    return this.http.get(AppConfig.BASE_URL + "jobs/" + userId + "/post");
  }

  /**
   * Get candidate list for one job
   * @param jobId
   * @returns {Observable<Response>}
   */
  getCandidateList(jobId: any) {
    return this.http.get(AppConfig.BASE_URL + "jobs/" + jobId + "/candidate");
  }

  /**
   * Function to get all posted jobs by userId
   * @param userId
   * @returns {Observable<Response>}
   */
  getJobsEnrolled(userId: any) {
    return this.http.get(AppConfig.BASE_URL + "jobs/" + userId + "/apply");
  }
}
