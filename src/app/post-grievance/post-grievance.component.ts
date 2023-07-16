import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocalStorageUtil} from "../../localStorageUtil";
import {ApiService} from "../../apiService";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-post-grievance',
  templateUrl: './post-grievance.component.html',
  styleUrls: ['./post-grievance.component.css']
})
export class PostGrievanceComponent implements OnInit {

  postGrievance: FormGroup = new FormGroup<any>({});
  isSubmitted: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private  apiService: ApiService,
              private toastr: NgToastService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.postGrievance = this.formBuilder.group({
      stayAnonymous: [undefined],
      title: [undefined, Validators.required],
      description: [undefined, Validators.required]
    });
  }

  submit() {
    this.isSubmitted = true;
    if (this.postGrievance.invalid) {
      return;
    } else {
      const article =
      {
        title: this.postGrievance.get('title')?.value,
        content: this.postGrievance.get('description')?.value,
        author: LocalStorageUtil.getStorage().id,
        stay_anonymous: this.postGrievance.get('stayAnonymous')?.value
      }
      console.log(article);
      this.apiService.postArticle(article).subscribe(res => {
        console.log(res);
        this.toastr.success({detail: 'Success', summary: 'Posted Grievance Successfully.', duration: 2000});
        this.postGrievance.get('title')?.patchValue(null);
        this.postGrievance.get('description')?.patchValue(null);
        this.isSubmitted = false;
      }, error => {
        console.log(error);
        this.toastr.error({detail: 'Error', summary: 'Failed posting grievance', duration: 2000})
      });

    }
  }

}
