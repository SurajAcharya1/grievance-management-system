import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from "../../apiService";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NgToastService} from "ng-angular-popup";
import {TitleCasePipe} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";
import _default from "chart.js/dist/plugins/plugin.tooltip";
import numbers = _default.defaults.animations.numbers;

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
  backgroundColor = 'white';
  textColor = 'black';
  barData!: any;
  completionLabel: string[] = [];
  completionData: number[] = [];
  @ViewChild('completionWiseGrievance', { static: true }) completionWiseGrievance!: TemplateRef<any>;
  articleCompletionType = '';
  completionWiseArticles: Array<any> = new Array<any>();
  completionArticlePage: number = 1;
  completeCount = 0;
  incompleteCount = 0;

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
      this.preparePieChartData();
      this.prepareBarChartData();
      this.prepareCompletionChartData();
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
      this.incompleteCount = this.articlesCount;
      this.completeCount = this.articles?.length - this.articlesCount;
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

  preparePieChartData() {
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

  prepareBarChartData() {
      const labelSet: Set<string> = new Set<string>();
      this.articles.forEach((value: any) => {
        labelSet.add(this.titleCase.transform(value?.sentiment))
      });
      this.label = Array.from(labelSet);
      const dataStructure = {
        x: '',
        total: 0,
        complete: 0,
        inComplete: 0
      }
      let data: typeof dataStructure[] = []
      data.push({
        x: 'Positive',
        total: this.articles.filter(value => value.sentiment === 'positive').length,
        complete: this.articles.filter(value => value.is_completed && value.sentiment === 'positive').length,
        inComplete: this.articles.filter(value => !value.is_completed && value.sentiment === 'positive').length
      });
      data.push({
        x: 'Negative',
        total: this.articles.filter(value => value.sentiment === 'negative').length,
        complete: this.articles.filter(value => value.is_completed && value.sentiment === 'negative').length,
        inComplete: this.articles.filter(value => !value.is_completed && value.sentiment === 'negative').length
      });
      data.push({
        x: 'Neutral',
        total: this.articles.filter(value => value.sentiment === 'neutral').length,
        complete: this.articles.filter(value => value.is_completed && value.sentiment === 'neutral').length,
        inComplete: this.articles.filter(value => !value.is_completed && value.sentiment === 'neutral').length
      });
      this.barData = {
        labels: ['Positive', 'Negative', 'Neutral'],
        datasets: [
          {
            label: 'Total Articles',
            data: data,
            parsing: {
              yAxisKey: 'total'
            }
          },
          {
            label: 'Completed Articles',
            data: data,
            parsing: {
              yAxisKey: 'complete'
            }
          },
          {
            label: 'Incomplete Articles',
            data: data,
            parsing: {
              yAxisKey: 'inComplete'
            }
          }
        ]
      }
  }

  sentimentTypeEventHandler(event: any) {
      console.log('event', event);
    if (event === 'Positive' || event === 'Negative' || event === 'Neutral') {
      this.p = 1;
      this.sentimentWiseArticles = [];
      this.selectedSentiment = event;
      this.sentimentWiseArticles = this.articles.filter(value => value.sentiment === event?.toLowerCase());
      if (this.selectedSentiment === 'Positive') {
        this.backgroundColor = '#dff4e2';
        this.textColor = '#012903'
      }
      if (this.selectedSentiment === 'Negative') {
        this.backgroundColor = '#f8e1e1';
        this.textColor = '#250101'
      }
      if (this.selectedSentiment === 'Neutral') {
        this.backgroundColor = '#f6f4e0';
        this.textColor = '#3a3502'
      }
    } else {
      this.completionArticlePage = 1;
      if (event === 'Complete') {
        this.articleCompletionType = 'Completed Articles';
        this.completionWiseArticles = this.articles.filter(value => value?.is_completed);
      } else {
        this.articleCompletionType = 'Incomplete Articles';
        this.completionWiseArticles = this.articles.filter(value => !value?.is_completed);
      }
      const completionGrievancesModalRef =  this.model.open(this.completionWiseGrievance, {
        size: "xl",
        animation: true,
        centered: true
      });
      this.modalReferenceMap.set('completionGrievancesModalRef', completionGrievancesModalRef);
    }
  }

  getAllGrievances() {
    this.selectedSentiment = '';
    this.sentimentWiseArticles = [];
    this.sentimentWiseArticles = this.articles;
      this.backgroundColor = 'white';
      this.textColor = 'black'
  }

  prepareCompletionChartData() {
      this.completionLabel = ['Complete', 'Incomplete'];
      this.completionData.push(this.articles.filter(value => value?.is_completed)?.length);
      this.completionData.push(this.articles.filter(value => !value?.is_completed)?.length);

  }
}
