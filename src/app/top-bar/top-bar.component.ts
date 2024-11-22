import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {LocalStorageUtil} from "../../localStorageUtil";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TimeoutComponent} from "../timeout/timeout.component";
import {NgToastService} from "ng-angular-popup";
import {ApiService} from "../../apiService";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})

export class TopBarComponent implements OnInit {
  @Input() showSearchBar: boolean = false;
  currentUser!: string;
  isAdmin!: boolean;
  timer: any;

  searchForm: FormGroup = new FormGroup<any>({});
  expanded = true;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private apiService: ApiService) { }

  ngOnInit(): void {
    const url = this.router.url;
    if (url === '/user/my-grievances' ||
        url === '/user/dashboard' ||
        url === '/admin/pending-grievances') {
      this.showSearchBar = true;
    }
    this.buildForm();
    this.currentUser = LocalStorageUtil.getStorage().name;
    this.isAdmin = LocalStorageUtil.getStorage().is_admin;
  }

  /*signOut() {
    LocalStorageUtil.clearStorage()
    this.router.navigate(['']);
    this.toastService.success({detail: 'success', summary: 'Logged out successfully', duration: 2000});
  }*/

  search() {
    this.apiService.searchKeyWord.next(this.searchForm.get('searchKeyWord')?.value);
  }

  buildForm() {
    this.searchForm = this.formBuilder.group({
      searchKeyWord: [undefined]
    })
  }
  expandCollapse() {
    this.expanded = !this.expanded;
    this.apiService.sideBarExpanded.next(this.expanded);
  }
}
