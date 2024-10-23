import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from "../../apiService";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NgToastService} from "ng-angular-popup";
import {TitleCasePipe} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  articles: Array<any> = new Array<any>();
  p: number = 1;
  articlesCount: number = 0;
  totalUsersCount: number = 0;
  pendingUsersCount: number = 0;

  openedArticleTitle: any;
  openedArticleContent: any;
  openedArticleStatus: any;
  openedArticleId: any;
  label: string[] = [];
  data: number[] = [];
  sentimentWiseArticles: Array<any> = new Array<any>();
  @ViewChild('sentimentWiseGrievances', { static: true }) sentimentWiseGrievances!: TemplateRef<any>;
  selectedSentiment: any;
  modalReferenceMap: Map<string, NgbModalRef> = new Map<string, NgbModalRef>();
  isLoading = false;
  expanded = true;

  constructor(private apiService: ApiService,
              private model: NgbModal,
              private toastService: NgToastService,
              private titleCase: TitleCasePipe,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getArticles();
    this.apiService.sideBarExpanded.subscribe(value => {
      this.expanded = value;
    });
  }

  getArticles() {
    this.spinner.show();
    this.isLoading = true;
    this.apiService.getAllArticles().subscribe( (res: any) => {
      res.forEach((v: any) => {
        this.articles.push(v);
      });
      this.sentimentWiseArticles = this.articles;
      console.log(this.articles);
      this.prepareChartData();
      if (this.selectedSentiment) {
        this.sentimentWiseArticles = [];
        this.sentimentWiseArticles = this.articles.filter(value => value.sentiment === this.selectedSentiment?.toLowerCase());
      }
      this.getArticlesCount();
    }, error => {
      this.spinner.hide();
      this.isLoading = false;
      console.log(error);
    });
  }

  getArticlesCount() {
    this.getTotalUsersCount();
    this.apiService.getArticles().subscribe((res: any) => {
      this.articlesCount = res.length;
    }, error => {
      this.spinner.hide();
      this.isLoading = false;
      console.log(error);
    });
  }

  getTotalUsersCount() {
    this.getPendingUsersCount();
    this.apiService.getAllUsers().subscribe((res: any) => {
      this.totalUsersCount = res.length;
    }, error => {
      this.spinner.hide();
      this.isLoading = false;
      console.log(error);
    });
  }

  getPendingUsersCount() {
    this.apiService.getApprovalPendingUsers().subscribe((res: any) => {
      this.pendingUsersCount = res.length;
      this.spinner.hide();
      this.isLoading = false;
    }, error => {
      this.spinner.hide();
      this.isLoading = false;
      console.log(error);
    });
  }

  openModel(model: any, title: any, content: any, status: any, id: any){
    this.openedArticleTitle = title;
    this.openedArticleContent = content;
    this.openedArticleStatus = status ? 'Completed' : 'Pending';
    this.openedArticleId = id;
    const grievanceDetailModalRef = this.model.open(model, {
      size: "lg",
      animation: true,
      centered: true
    });
    this.modalReferenceMap.set('grievanceDetailModalRef', grievanceDetailModalRef);
  }

  close(modalRefName: string) {
    const modalRef = this.modalReferenceMap.get(modalRefName);
    if (modalRef) {
      modalRef.close();
    }
  }

  completeArticle = (id: number) => {
    this.spinner.show();
    const data =
      {
        is_completed: true
      }
    this.apiService.completeArticle(id, data).subscribe(res => {
      this.close('grievanceDetailModalRef');
      this.articles = new Array<any>();
      this.getArticles();
      this.getArticlesCount();
      this.toastService.success({detail: 'Success', summary: 'Successfully changed the article status', duration: 2000});
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.isLoading = false;
      this.toastService.error({detail: 'Error', summary: 'Error changing article status.', duration: 2000});
    })
  }

  prepareChartData() {
      const labelSet: Set<string> = new Set<string>();
      this.articles.forEach((value: any) => {
        labelSet.add(this.titleCase.transform(value?.sentiment))
      });
      this.label = Array.from(labelSet);
      this.data = new Array(this.label.length).fill(0);
      this.label.forEach((value: string) => {
      this.data[this.label.findIndex(val => val === value)] =
        this.articles.filter((article: any) => article?.sentiment === value?.toLowerCase())?.length;
      });
  }

  sentimentTypeEventHandler(event: any) {
    this.p = 1;
    this.sentimentWiseArticles = [];
    this.selectedSentiment = event;
    this.sentimentWiseArticles = this.articles.filter(value => value.sentiment === event?.toLowerCase());
    /*const sentimentWiseGrievancesModalRef =  this.model.open(this.sentimentWiseGrievances, {
      size: "xl",
      animation: true,
      centered: true
    });
    this.modalReferenceMap.set('sentimentWiseGrievancesModalRef', sentimentWiseGrievancesModalRef);*/
  }

  getAllGrievances() {
    this.selectedSentiment = '';
    this.sentimentWiseArticles = [];
    this.sentimentWiseArticles = this.articles;
  }
}
