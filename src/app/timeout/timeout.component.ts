import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocalStorageUtil} from "../../localStorageUtil";
import {ApiService} from "../../apiService";
import {NgToastService} from "ng-angular-popup";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TopBarComponent} from "../top-bar/top-bar.component";

@Component({
  selector: 'app-timeout',
  templateUrl: './timeout.component.html',
  styleUrls: ['./timeout.component.css']
})
export class TimeoutComponent implements OnInit {

  timeOutForm: FormGroup = new FormGroup<any>({});
  isSubmitted = false;
  userDetails: any;
  constructor(private formBuilder: FormBuilder,
              private apiService: ApiService,
              private toastService: NgToastService,
              private router: Router,
              private modal: NgbModal) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.timeOutForm = this.formBuilder.group({
      password: [undefined, [Validators.required, Validators.minLength(8)]]
    })
  }

  submit() {
    console.log(this.timeOutForm.get('password')?.value);
    this.isSubmitted = true;
    if (this.timeOutForm.invalid) {
      return
    } else {
      let token: any = '';
      const userCredentials =
        {
          email: (LocalStorageUtil.getStorage().email),
          password: (this.timeOutForm.get('password')?.value)
        };
      this.apiService.login(userCredentials).subscribe(res => {
        token = res;
        this.modal.dismissAll();
        this.getUser(token);
      }, error => {
        this.router.navigate([''])
        this.modal.dismissAll();
        this.toastService.error({detail: 'error', summary: 'Enter valid credentials', duration: 2000});
        console.log(error);
      });
    }
  }
  getUser(token: any) {
    this.apiService.getLoggedInUserDetails().subscribe(res => {
      this.userDetails = res;
      const storage = LocalStorageUtil.getStorage();
      storage.id = this.userDetails.id;
      storage.name = this.userDetails.name;
      storage.email = this.userDetails.email;
      storage.is_admin = this.userDetails.is_admin;
      storage.is_approved = this.userDetails.is_approved;
      storage.token = token.jwt;
      storage.exp = token.exp
      LocalStorageUtil.setStorage(storage);
      this.toastService.success({detail: 'success', summary: 'logged in successfully', duration: 2000});
      /*if (LocalStorageUtil.getStorage().is_admin) {
        this.router.navigate(['admin-dashboard']);
      } else {
        this.router.navigate(['dashboard']);
      }*/
    }, error => {
      console.log(error);
    });
  }
}
