import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../apiService";
import {NgToastService} from "ng-angular-popup";
import {LocalStorageUtil} from "../../localStorageUtil";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup} from "@angular/forms";

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

  editArticleTitle: any;
  editArticleContent: any;
  editArticleAnonymity: any;

  editGrievance: FormGroup = new FormGroup<any>({});


  constructor(private formBuilder: FormBuilder,
              private apiService: ApiService,
              private toastr: NgToastService,
              private model: NgbModal) { }

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

  collapse(i: number, event: Event) {
    event.stopPropagation();
    if (!this.isNotCollapsed[i]) {
      this.isNotCollapsed[i] = true;
    } else {
      this.isNotCollapsed[i] = false;
    }
  }

  openModel(model: any, title: any, content: any, anonymity: any) {
    this.editArticleTitle = title;
    this.editArticleContent = content;
    this.editArticleAnonymity = anonymity;
    this.buildForm();
    this.model.open(model, {
      size: "lg",
      centered: true,
    });
  }

  closeModel() {
    this.model.dismissAll();
  }

  buildForm() {
    this.editGrievance = this.formBuilder.group({
      stayAnonymous: [this.editArticleAnonymity],
      title: [this.editArticleTitle],
      description: [this.editArticleContent],
    })
  }

  submit() {
    this.toastr.success({detail: 'Success', summary:'Grievance Edited Successfully.', duration: 2000});
    this.closeModel();
  }

  delete() {

  }

}
