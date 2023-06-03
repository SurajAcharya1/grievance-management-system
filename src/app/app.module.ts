import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { BodyComponent } from './body/body.component';
import {HttpClientModule} from "@angular/common/http";
import {NgToastModule} from "ng-angular-popup";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule} from "ngx-toastr";

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    DashboardComponent,
    TopBarComponent,
    SideBarComponent,
    BodyComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        NgToastModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
          positionClass: 'toast-top-left',
          timeOut: 15000,
          closeButton: true,
          // progressBar: true,
        }),
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
