import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  title = 'grievance-management-system';
  temail = 'surajacharya13579@gmail.com';
  tpassword = 'suraj';

  loginForm: FormGroup = new FormGroup<any>({});

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      email: [undefined],
      password: [undefined]
    });
  }

  submit() {
    const e = (this?.loginForm?.get('email')?.value);
    const p = (this.loginForm.get('password')?.value);
    if(this?.loginForm?.get('email')?.value === this.temail && this?.loginForm?.get('password')?.value === this.tpassword) {
      window.alert('valid user');
    } else {
    window.alert('invalid user');
    }
  }

  openSignupModel() {

  }
}
