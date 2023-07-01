import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AuthGuard} from "./shared/auth.guard";
import {PostGrievanceComponent} from "./post-grievance/post-grievance.component";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {AllUsersComponent} from "./all-users/all-users.component";
import {ApprovalRequestComponent} from "./approval-request/approval-request.component";
import {AccountComponent} from "./account/account.component";

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'post-grievance', component: PostGrievanceComponent, canActivate: [AuthGuard]},
  {path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard]},
  {path: 'users', component: AllUsersComponent, canActivate: [AuthGuard]},
  {path: 'user-approval-request', component: ApprovalRequestComponent, canActivate: [AuthGuard]},
  {path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
