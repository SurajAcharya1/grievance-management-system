import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../apiService";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  searchKeyWord: any;
  expanded = true;
  showSearchBar = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.sideBarExpanded.subscribe(value => {
      this.expanded = value;
    });
    this.apiService.showSearchBar.subscribe(value => {
      this.showSearchBar = value;
    });
  }

  getSearchKeyWord(searchKeyWord: any) {
    this.searchKeyWord = searchKeyWord;
  }

}
