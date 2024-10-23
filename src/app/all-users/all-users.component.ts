import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../apiService";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {

  users: Array<any> = new Array<any>();
  userForm: FormGroup = new FormGroup<any>({});
  p: number = 1;
  userId: any;
  index: any;

  constructor(private apiService: ApiService,
              private formBuilder: FormBuilder,
              private toastr: NgToastService,
              private model: NgbModal,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.buildForm();
    this.getUsers();
  }

  buildForm() {
    this.userForm = this.formBuilder.group({
      userRole: this.formBuilder.array([])
    });
  }

  getUsers() {
    this.spinner.show();
    this.apiService.getAllUsers().subscribe((res: any) => {
      this.users = Array.from(res).filter((value: any) => value.is_approved);
      this.addRole(this.users);
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    })
  }

  deleteUser(id: number) {
    this.spinner.show();
    this.apiService.deleteUser(id).subscribe((res: any) => {
      this.toastr.success({detail: 'Success', summary: 'User Deleted Successfully', duration: 2000});
      // this.users.patchValue(null);
      /*res.forEach((val: any) => {
        this.users.push(val);
      })*/
      this.spinner.hide();
      this.getUsers();
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.toastr.error({detail: 'Error', summary: 'User Deletion failed', duration: 2000});
    });
  }

  addRole(user: any) {
    user.forEach((val: any)=> {
      (this.userForm.get('userRole') as FormArray).push(this.formBuilder.group({
        id: [val?.id],
        name: [val?.name],
        email: [val?.email],
        roles: [val?.is_admin ? 'Admin' : 'User'],
        is_approved: [val?.is_approved ? 'true' : 'false']
      }));
    });
  }

  openModel(model: any, userId: any, index: any) {
    this.userId = userId;
    this.index = index;
    this.model.open(model);
  }

  updateRole(id: number, i: number) {
    this.model.dismissAll();
    const roleData =
      {
        action: this.userForm.get(['userRole', i, 'roles'])?.value === 'Admin' ? 'promote' : 'demote'
      }
      this.spinner.show();
    this.apiService.promoteDemoteUser(id, roleData).subscribe(res => {
      this.toastr.success({detail: 'Success', summary: 'User role updated Successfully', duration: 2000});
      // this.userForm.get('userRole')?.reset();
      this.spinner.hide();
      this.getUsers();
    }, error => {
      this.toastr.error({detail: 'Error', summary: 'Failed to update user role', duration: 2000});
      console.log(error);
      this.spinner.hide();
    })
  }

  close() {
    this.model.dismissAll();
  }
}
