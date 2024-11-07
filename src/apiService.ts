import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";
import * as fs from "fs";
import {environment} from "./environments/environment";

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  public sideBarExpanded = new BehaviorSubject<boolean> (true);
  public showSearchBar = new BehaviorSubject<boolean> (false);
  public searchKeyWord = new Subject<string> ();
  public timeoutPopupActive = false;
  public reLoginComplete = new BehaviorSubject<boolean> (false);

  constructor(private httpClient: HttpClient) {
  }

  getArticles() {
    return this.httpClient.get(environment.baseApi + 'articles');
  }

  getAllArticles() {
    return this.httpClient.get(environment.baseApi + 'articles/all');
  }

  login(userCredentials: any) {
    return this.httpClient.post(environment.baseApi + 'login', userCredentials, {withCredentials: true});
  }

  getLoggedInUserDetails() {
    return this.httpClient.get(environment.baseApi + 'user', {withCredentials: true});
  }

  updateVote(id: number, voteType: any) {
    return this.httpClient.post(environment.baseApi + 'articles/' + id + '/vote/', voteType, {withCredentials: true});
  }

  register(userDetails: any) {
    return this.httpClient.post(environment.baseApi + 'register', userDetails);
  }

  getRelatedArticles(id: number) {
    return this.httpClient.get(environment.baseApi + 'articles/' + id + '/similar');
  }

  logout() {
    return this.httpClient.post(environment.baseApi + 'logout', {}, {withCredentials: true})
  }

  postArticle(article: any) {
    return this.httpClient.post( environment.baseApi + 'articles/create/', article, {withCredentials: true})
  }

  forgotPassword(email: any) {
    return this.httpClient.post(environment.baseApi + 'forgot-password/', email)
  }

  resetPassword(resetData: any) {
    return this.httpClient.post(environment.baseApi + 'reset-password/', resetData)
  }

  getAllUsers() {
    return this.httpClient.get (environment.baseApi + 'total-user', {withCredentials: true})
  }

  promoteDemoteUser(id: number, promoteDemoteData: any) {
    return this.httpClient.post(environment.baseApi + 'user/' + id + '/promote-demote/', promoteDemoteData, {withCredentials: true})
  }

  deleteUser(userId: any) {
    return this.httpClient.delete(environment.baseApi + 'user/delete/' + userId, {withCredentials: true})
  }

  getApprovalPendingUsers() {
    return this.httpClient.get(environment.baseApi + 'approval-requests', {withCredentials: true})
  }

  approveUser( userId: any) {
    return this.httpClient.post(environment.baseApi + 'approve-user/', userId, {withCredentials: true})
  }

  completeArticle(id: number, data: any) {
    return this.httpClient.put(environment.baseApi + 'articles/' + id + '/status/', data,  {withCredentials: true})
  }

  deleteArticle(id: number) {
    return this.httpClient.delete(environment.baseApi + 'articles/' + id + '/delete', {withCredentials: true});
  }

  updateArticle(id: number, data: any) {
    return this.httpClient.put(environment.baseApi + 'articles/' + id + '/edit/', data, {withCredentials: true});
  }

}
