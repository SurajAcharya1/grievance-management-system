import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../apiService";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  articles: any;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getArticles();
  }

  getArticles() {
    this.apiService.getArticles().subscribe( res => {
      this.articles = res;
      console.log(res);
    }, error => {
      console.log(error);
    });
  }
}
