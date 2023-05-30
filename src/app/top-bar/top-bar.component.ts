import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {LocalStorageUtil} from "../../localStorageUtil";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  constructor(private router: Router,
              private toastService: NgToastService) { }

  ngOnInit(): void {
  }

  signOut() {
    LocalStorageUtil.clearStorage()
    this.router.navigate(['']);
    this.toastService.success({detail: 'success', summary: 'Logged out successfully', duration: 2000});
  }

}
