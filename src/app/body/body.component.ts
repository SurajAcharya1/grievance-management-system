import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../apiService";

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

  constructor(private service: ApiService) { }

  ngOnInit(): void {
    this.getArticles();
  }

  getArticles() {
    this.service.getData().subscribe(res => {
      this.articles = res;
      console.log(this.articles);
      }, (error) => {
      console.log(error);
      })
  }

  upVote(i: number) {
    if (this.hasVoted[i]) {
      this.hasVoted[i] = false;
      this.setVotes(--this.votes[i], i);
    } else {
      this.hasVoted[i] = true;
      this.setVotes(++this.votes[i], i);
    }
    this.voteType[i] = true;
  }

  downVote(i: number) {
    if (this.hasVoted[i]) {
      this.hasVoted[i] = false;
      this.setVotes(++this.votes[i], i);
    } else {
      this.hasVoted[i] = true;
      this.setVotes(--this.votes[i], i);
    }
    this.voteType[i] = false;
  }

  setVotes(v: number, i:number) {
    this.votes[i] = v;
  }

}
