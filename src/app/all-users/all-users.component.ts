import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../apiService";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {

  users: any;
  userForm: FormGroup = new FormGroup<any>({});

  constructor(private apiService: ApiService,
              private formBuilder: FormBuilder,
              private toastr: NgToastService) { }

  ngOnInit(): void {
    this.buildForm();
    this.getUsers();
  }

  buildForm() {
    this.userForm = this.formBuilder.group({
      roles: [undefined]
    });
  }

  getUsers() {
    this.apiService.getAllUsers().subscribe(res => {
      this.users = res;
      console.log(res);
    }, error => {
      console.log(error);
    })
  }

  deleteUser(id: number) {
    this.apiService.deleteUser(id).subscribe(res => {
      this.toastr.success({detail: 'Success', summary: 'User Deleted Successfully', duration: 2000});
      this.getUsers();
    }, error => {
      console.log(error);
      this.toastr.error({detail: 'Error', summary: 'User Deletion failed', duration: 2000});
    });
  }
}
