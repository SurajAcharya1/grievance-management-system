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
  currentUser!: string;
  isAdmin!: boolean;

  constructor(private router: Router,
              private toastService: NgToastService) { }

  ngOnInit(): void {
    this.currentUser = LocalStorageUtil.getStorage().name;
    this.isAdmin = LocalStorageUtil.getStorage().is_admin;
  }

  signOut() {
    LocalStorageUtil.clearStorage()
    this.router.navigate(['']);
    this.toastService.success({detail: 'success', summary: 'Logged out successfully', duration: 2000});
  }

}
