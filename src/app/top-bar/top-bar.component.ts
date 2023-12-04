import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {LocalStorageUtil} from "../../localStorageUtil";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TimeoutComponent} from "../timeout/timeout.component";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})

export class TopBarComponent implements OnInit {
  @Input() hasArticle: boolean = false;
  @Output() getSearchKeyWord: EventEmitter<any> = new EventEmitter<any>();
  currentUser!: string;
  isAdmin!: boolean;
  timer: any;

  searchForm: FormGroup = new FormGroup<any>({});

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private modal: NgbModal,
              private toast: NgToastService) { }

  ngOnInit(): void {
    this.buildForm();
    this.currentUser = LocalStorageUtil.getStorage().name;
    this.isAdmin = LocalStorageUtil.getStorage().is_admin;
    this.autoLogOut();
  }

  /*signOut() {
    LocalStorageUtil.clearStorage()
    this.router.navigate(['']);
    this.toastService.success({detail: 'success', summary: 'Logged out successfully', duration: 2000});
  }*/

  search() {
    this.getSearchKeyWord.emit(this.searchForm.get('searchKeyWord')?.value);
  }

  buildForm() {
    this.searchForm = this.formBuilder.group({
      searchKeyWord: [undefined]
    })
  }

  autoLogOut() {
     this.timer = setTimeout(() => {
      const expDate = new Date(LocalStorageUtil.getStorage()?.exp);
      const currdate = new Date().getTime();
       console.log(expDate.getTime());
       console.log(new Date().getTime);
       if (expDate.getTime() < currdate) {
        this.modal.open(TimeoutComponent);
      }
    }, new Date(LocalStorageUtil.getStorage()?.exp).getTime() - new Date().getTime());
  }
}
