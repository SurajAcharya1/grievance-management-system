import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../apiService";
import {LocalStorageUtil} from "../../localStorageUtil";
import {NgToastService} from "ng-angular-popup";

export enum Vote {
  upvote = 'upvote',
  downvote = 'downvote'
}

@Component({
  selector: 'app-dashboard-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})

export class BodyComponent implements OnInit {

  articles: any;
  hasVoted: Array<boolean> = new Array<boolean>;
  voteType: Array<boolean> = new Array<boolean>;
  votes: Array<number> = new Array<number>;

  constructor(private apiService: ApiService,
              private toastService: NgToastService) { }

  ngOnInit(): void {
    this.getArticles();
  }

  getArticles() {
    this.apiService.getArticles().subscribe(res => {
      this.articles = res;
      }, (error) => {
      console.log(error);
      this.toastService.error({detail: 'Error', summary: 'could not update vote', duration: 2000});
      })
  }

  upVote(id: number) {
    this.apiService.updateVote(id, { vote_type: Vote.upvote }).subscribe(res => {
      this.getArticles();
      this.toastService.success({detail: 'Success', summary: 'voted', duration: 2000});
    }, error => {
      console.log(error);
      this.toastService.error({detail: 'Error', summary: 'could not update vote', duration: 2000});
    })
  }

  downVote(id: number) {
    this.apiService.updateVote(id, {vote_type: Vote.downvote}).subscribe( res => {
      this.getArticles();
      this.toastService.success({detail: 'Success', summary: 'voted', duration: 2000});
    }, error => {
      console.log(error);
      this.toastService.error({detail: 'Error', summary: 'could not update vote', duration: 2000});
    });
  }

  setVotes(v: number, i:number) {
    this.votes[i] = v;
  }

}
