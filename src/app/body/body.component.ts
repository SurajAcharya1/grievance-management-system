import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../apiService";
import {LocalStorageUtil} from "../../localStorageUtil";
import {NgToastService} from "ng-angular-popup";

export enum Vote {
  upvote = 'upvote',
  downvote = 'downvote'
}

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})

export class BodyComponent implements OnInit {

  articles: any;
  hasUpVoted: Array<boolean> = new Array<boolean>;
  hasDownVoted: Array<boolean> = new Array<boolean>;
  canUpvote: Array<boolean> = new Array<boolean>;
  votes: Array<number> = new Array<number>;
  isAdmin: boolean = false;
  relatedArticles: any;
  loggedInUserId = LocalStorageUtil.getStorage().id;
  hasPressed: boolean = false;

  relatedArticleId: any;
  relatedArticleTitle!: string;

  constructor(private apiService: ApiService,
              private toastService: NgToastService) { }

  ngOnInit(): void {
    this.getArticles();
    this.isAdmin =  LocalStorageUtil.getStorage().is_admin ? true : false;
  }

  getArticles() {
    this.apiService.getArticles().subscribe(res => {
      this.articles = res;
      console.log(this.articles);
      // @ts-ignore
      this.articles.forEach(v => {
        if (v.upvoted_by.includes(LocalStorageUtil.getStorage().id)) {
          this.hasUpVoted.push(true);
        } else {
          this.hasUpVoted.push(false);
        }
      });
      console.log('hasUpVoted:::', this.hasUpVoted);
      // @ts-ignore
      this.articles.forEach(v => {
        if (v.downvoted_by.includes(LocalStorageUtil.getStorage().id)) {
          this.hasDownVoted.push(true);
        } else {
          this.hasDownVoted.push(false);
        }
      });
      console.log('hasDownVoted:::', this.hasDownVoted);
    }, (error) => {
      console.log(error);
      this.toastService.error({detail: 'Error', summary: 'could not update vote', duration: 2000});
      })
  }

  upVote(id: number, hasUpVoted: any) {
    if (hasUpVoted) {
      this.downVote(id, false);
    } else {
      this.apiService.updateVote(id, { vote_type: Vote.upvote }).subscribe(res => {
        this.hasUpVoted = new Array<boolean>;
        this.hasDownVoted = new Array<boolean>;
        this.getArticles();
        this.getRelatedArticles(this.relatedArticleId, this.relatedArticleTitle);
        this.toastService.success({detail: 'Success', summary: 'voted', duration: 2000});
      }, error => {
        console.log(error);
        this.toastService.error({detail: 'Error', summary: 'could not update vote', duration: 2000});
      });
    }
  }

  downVote(id: number, hasDownVoted: any) {
    if (hasDownVoted) {
      this.upVote(id, false);
    } else {
      this.apiService.updateVote(id, {vote_type: Vote.downvote}).subscribe( res => {
        this.hasUpVoted = new Array<boolean>;
        this.hasDownVoted = new Array<boolean>;
        this.getArticles();
        this.getRelatedArticles(this.relatedArticleId, this.relatedArticleTitle);
        this.toastService.success({detail: 'Success', summary: 'voted', duration: 2000});
      }, error => {
        console.log(error);
        this.toastService.error({detail: 'Error', summary: 'could not update vote', duration: 2000});
      });
    }
  }

  setVotes(v: number, i:number) {
    this.votes[i] = v;
  }

  getRelatedArticles(id: number, title: string) {
    this.apiService.getRelatedArticles(id).subscribe(res => {
      this.relatedArticles = res;
      this.hasPressed = true;
      this.relatedArticles.push(title);
      this.relatedArticleId = id;
      this.relatedArticleTitle = title;
    }, error => {
      console.log(error);
    });
  }

  close() {
    this.hasPressed = false;
    this.relatedArticleId = null;
  }

}
