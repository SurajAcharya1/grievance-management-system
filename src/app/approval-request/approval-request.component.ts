import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../apiService";
import {NgToastService} from "ng-angular-popup";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerService} from "ngx-spinner";
import {take} from "rxjs";

@Component({
  selector: 'app-approval-request',
  templateUrl: './approval-request.component.html',
  styleUrls: ['./approval-request.component.css']
})
export class ApprovalRequestComponent implements OnInit {

  approvalPendingUsers: any
  p: number = 1;
  userId: any;
  expanded = true;

  constructor(private apiService: ApiService,
              private toastr: NgToastService,
              private model: NgbModal,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getApprovalPendingUsers();
  }

  getApprovalPendingUsers() {
    this.spinner.show();
    this.apiService.getApprovalPendingUsers().subscribe(res => {
      this.approvalPendingUsers = res;
      console.log(res);
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    })
  }

  approveUser(id: number) {
    const userId =
      {
        user_id: id
      }
    this.spinner.show();
    this.apiService.approveUser(userId).subscribe(res => {
      this.toastr.success({detail: 'Success', summary: 'User Approved', duration: 2000});
      this.spinner.hide();
      this.getApprovalPendingUsers();
      this.model.dismissAll();
    }, error => {
      this.toastr.error({detail: 'Error', summary: 'Could not approve user', duration: 2000});
      this.model.dismissAll();
      this.spinner.hide();
    })
  }

  openModal(model: any, id: any) {
    this.userId = id;
    this.model.open(model);

  }

  close() {
    this.model.dismissAll();
  }

}
