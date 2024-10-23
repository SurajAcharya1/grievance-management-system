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
  backgroundColor = '';
  textColor = '';

  constructor(private formBuilder: FormBuilder,
              private modal: NgbModal,
              private apiService: ApiService) { }

  ngOnInit(): void {
    this.buildForm();
    this.currentUser = LocalStorageUtil.getStorage().name;
    this.isAdmin = LocalStorageUtil.getStorage().is_admin;
    this.autoLogOut();
    this.backgroundColor = this.getRandomBackgroundColor();
    this.textColor = this.getRandomTextColor(this.backgroundColor);

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

  autoLogOut() {
    setTimeout(() => {
      const expDate = new Date(LocalStorageUtil.getStorage()?.exp).getTime();
      const currdate = new Date().getTime();
      console.log(expDate);
      console.log(currdate);
      console.log('diff:: ', (expDate - currdate));
      if (expDate < currdate) {
        this.modal.open(TimeoutComponent);
      }
    }, new Date(LocalStorageUtil.getStorage()?.exp).getTime() - new Date().getTime());
  }
  expandCollapse() {
    this.expanded = !this.expanded;
    this.apiService.sideBarExpanded.next(this.expanded);
  }

  getRandomBackgroundColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getRandomTextColor(color: string) {
    let colorValue = parseInt(color.slice(1), 16);
    let invertedColorValue = 0xFFFFFF ^ colorValue;
    let invertedColor = "#" + invertedColorValue.toString(16).padStart(6, '0');
    return invertedColor;
  }
}
