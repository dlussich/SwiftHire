import { RouterModule, Routes } from "@angular/router";
import { JobsComponent } from "./jobs/jobs.component";
import { JobDetailsComponent } from "./job-details/job-details.component";
import { JobDetailComponent } from "./job-details/job_detail.component";
import { ErrorComponent } from "./error/error.component";
import { CandidatesComponent } from './component/candidates.component';
import { CandidateComponent } from './component/candidate.component';
import { JobsPostedComponent } from './component/jobsposted.component';
import { JobsEnrolledComponent } from './component/jobenrolled.component';
import { RateCommentComponent } from './component/ratecomment.component';
import { MyCanActivateGuard } from './guard/mycanactivate.guard';
import { CreateJobComponent } from './component/createjob.component';

const MY_ROUTES: Routes = [
    { path: '', redirectTo: 'jobs', pathMatch: 'full' },
    { path: 'jobs', component: JobsComponent, canActivate:[MyCanActivateGuard]},
    { path: 'details', canActivate:[MyCanActivateGuard], component: JobDetailsComponent },
    { path: 'error', component: ErrorComponent },
     //children:[
      //  { path: 'details/:id', component: JobDetailsComponent },
    //]
     // A redirect route requires a pathMatch property to tell the router how to match a URL to the path of a route.
     // The default matching strategy of Angular router is
     // to match the redirect route when the URL begins with the redirect route's prefix path.
     // if 'prefix' all params/routes/xx will be redirected to homepage

    { path: 'jobs/posted', canActivate:[MyCanActivateGuard], component: JobsPostedComponent, children:[
      {path: 'addcomment', canActivate:[MyCanActivateGuard], component: RateCommentComponent},
      { path: 'candidates', canActivate:[MyCanActivateGuard],  component: CandidatesComponent, children:[
        {path: 'detail', canActivate:[MyCanActivateGuard], component: CandidateComponent}
      ]}
    ]},

    { path: 'jobs/enrolled', canActivate:[MyCanActivateGuard], component: JobsEnrolledComponent, children:[
        {path: 'addcomment', canActivate:[MyCanActivateGuard], component: RateCommentComponent},
        { path: 'details', canActivate:[MyCanActivateGuard], component: JobDetailComponent }
    ]},

    { path: 'jobs/addJob', canActivate:[MyCanActivateGuard], component: CreateJobComponent},

     // ** for all routes that we don't recognize,
     // Routes served from top to bottom so this should always come last!
     { path: '**', redirectTo: '/'}
];

export const myRoutes = RouterModule.forRoot(MY_ROUTES);
