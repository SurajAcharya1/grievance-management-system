import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  title = 'grievance-management-system';
  temail = 'a';
  tpassword = 'a';

  loginForm: FormGroup = new FormGroup<any>({});

  constructor(
    private client: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
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
    let data: any;
    const loginData =
      {
        email:e,
        password:p
      };
    console.log(e);
    console.log(p);
    this.client.post('http://localhost:8000/api/login', loginData).subscribe(res => {
      data = res;
      console.log(res);
      this.getUser();
      this.router.navigate(['dashboard']);
    }, error => {
      console.log(error);
      alert('login failed');
    });
    /*if(this?.loginForm?.get('email')?.value === this.temail && this?.loginForm?.get('password')?.value === this.tpassword) {
      this.router.navigate(['dashboard']);
    } else {
    }*/
  }

  getUser() {
    this.client.get('http://localhost:8000/api/user').subscribe(res => {
      console.log(res);
    }, error => {
      console.log(error);
    })
  }
}
