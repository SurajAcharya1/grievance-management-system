import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../apiService";
import {LocalStorageEmail, LocalStorageUtil} from "../../localStorageUtil";
import {NgToastService} from "ng-angular-popup";
import {ToastrService} from "ngx-toastr";
import {TimeoutComponent} from "../timeout/timeout.component";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  title = 'grievance-management-system';

  loginForm: FormGroup = new FormGroup<any>({});
  userDetails: any;
  isSubmitted: boolean = false;
  rememberMe: boolean = false;
  rememberedEmail: any;
  toggled: boolean = false;

  constructor(
    private client: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private toastService: NgToastService,
    private ngxToastr: ToastrService
  ) { }

  ngOnInit() {
    this.buildForm();
    if (LocalStorageUtil.getEmailStorage().rememberMeEmail) {
      this.rememberMe = true;
      this.rememberedEmail = LocalStorageUtil.getEmailStorage().rememberMeEmail;
      this.loginForm.get('email')?.patchValue(this.rememberedEmail);
      this.loginForm.get('rememberMe')?.patchValue(true);
    }
  }

  buildForm() {
    this.hasClickedRememberMe();
    this.loginForm = this.formBuilder.group({
      email: [undefined, [Validators.required, Validators.email]],
      password: [undefined, [Validators.required]],
      rememberMe: [undefined]
    });
  }

  submit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return
    } else {
      let token: any = '';
      const userCredentials =
        {
          email: (this?.loginForm?.get('email')?.value),
          password: (this.loginForm.get('password')?.value)
        };
      this.apiService.login(userCredentials).subscribe(res => {
        token = res;
        console.log('res:::', res);
        this.getUser(token.jwt, token.exp);
        if (this?.loginForm?.get('rememberMe')?.value) {
          const storage = LocalStorageUtil.getEmailStorage();
          storage.rememberMeEmail = this?.loginForm?.get('email')?.value;
          LocalStorageUtil.setEmailStorage(storage);
        } else {
          LocalStorageUtil.clearEmailStorage();
        }
      }, error => {
        this.toastService.error({detail: 'error', summary: 'log in failed', duration: 2000});
        console.log(error);
      });
    }
  }

  getUser(token: string, exp: any) {
    this.apiService.getLoggedInUserDetails().subscribe(res => {
      this.userDetails = res;
      console.log('user:::', this.userDetails);
      const storage = LocalStorageUtil.getStorage();
      storage.id = this.userDetails.id;
      storage.name = this.userDetails.name;
      storage.email = this.userDetails.email;
      storage.is_admin = this.userDetails.is_admin;
      storage.is_approved = this.userDetails.is_approved;
      storage.token = token;
      storage.exp = exp;
      LocalStorageUtil.setStorage(storage);
      this.toastService.success({detail: 'success', summary: 'logged in successfully', duration: 2000});
      if (LocalStorageUtil.getStorage().is_admin) {
        this.router.navigate(['admin/dashboard']);
      } else {
        this.router.navigate(['user/dashboard']);
      }
    }, error => {
      console.log(error);
    });
  }

  onToggle() {
    this.toggled ? this.toggled = false : this.toggled = true;
  }

  hasClickedRememberMe() {
    if (LocalStorageUtil.getEmailStorage().rememberMeEmail) {
      const localStorage = LocalStorageUtil.getStorage();
      const expDate = new Date(localStorage?.exp).getTime();
      const currdate = new Date().getTime();
      if (expDate > currdate) {
        if (localStorage?.is_admin) {
            this.router.navigate(['admin/dashboard']);
        } else {
          this.router.navigate(['user/dashboard']);
        }
      }
    }
  }
}
