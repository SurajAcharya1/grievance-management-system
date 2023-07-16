import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../apiService";
import {NgToastService} from "ng-angular-popup";
import {LocalStorageUtil} from "../../localStorageUtil";

@Component({
  selector: 'app-my-grievance',
  templateUrl: './my-grievance.component.html',
  styleUrls: ['./my-grievance.component.css']
})
export class MyGrievanceComponent implements OnInit {

  allArticles: Array<any> = Array<any>();
  myArticles: Array<any> = Array<any>();
  userId: number = LocalStorageUtil.getStorage().id;
  isNotCollapsed: Array<boolean> = Array<boolean>();

  constructor(private apiService: ApiService,
              private toastr: NgToastService) { }

  ngOnInit(): void {
    this.getMyArticles();
  }

  getMyArticles() {
    this.apiService.getAllArticles().subscribe((res: any) => {
      this.allArticles = res;
      this.allArticles.filter(value => {value.author === this.userId ? this.myArticles.push(value) : ''})
      console.log(this.userId);
      console.log(res);
      console.log(this.myArticles);
    }, error => {
      console.log(error);
      this.toastr.success({summary: 'Error', detail: 'Error getting My Grievances', duration: 2000})
    })
  }

  collapse(i: number) {
    if (!this.isNotCollapsed[i]) {
      this.isNotCollapsed[i] = true;
    } else {
      this.isNotCollapsed[i] = false;
    }
  }

}
