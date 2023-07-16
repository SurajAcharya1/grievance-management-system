import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../apiService";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  articles: any;
  p: number = 1;
  articlesCount: number = 0;
  totalUsersCount: number = 0;
  pendingUsersCount: number = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getArticles();
    this.getArticlesCount();
  }

  getArticles() {
    this.apiService.getAllArticles().subscribe( res => {
      this.articles = res;
      console.log(res);
    }, error => {
      console.log(error);
    });
  }

  getArticlesCount() {
    this.getTotalUsersCount();
    this.apiService.getArticles().subscribe((res: any) => {
      this.articlesCount = res.length;
    }, error => {
      console.log(error);
    });
  }

  getTotalUsersCount() {
    this.getPendingUsersCount();
    this.apiService.getAllUsers().subscribe((res: any) => {
      this.totalUsersCount = res.length;
    }, error => {
      console.log(error);
    });
  }

  getPendingUsersCount() {
    this.apiService.getApprovalPendingUsers().subscribe((res: any) => {
      this.pendingUsersCount = res.length;
    }, error => {
      console.log(error);
    });
  }
}
