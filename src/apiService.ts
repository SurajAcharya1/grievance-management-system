import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  public static readonly baseApi = 'http://localhost:8000/api/';

  constructor(private httpClient: HttpClient) {
  }

  getArticles() {
    return this.httpClient.get(ApiService.baseApi + 'articles');
  }

  login(userCredentials: any) {
    return this.httpClient.post(ApiService.baseApi + 'login', userCredentials, {withCredentials: true});
  }

  getLoggedInUserDetails() {
    return this.httpClient.get(ApiService.baseApi + 'user', {withCredentials: true});
  }

  updateVote(id: number, voteType: any) {
    return this.httpClient.post(ApiService.baseApi + 'articles/' + id + '/vote/', voteType, {withCredentials: true});
  }

  register(userDetails: any) {
    return this.httpClient.post(ApiService.baseApi + 'register', userDetails);
  }

  getRelatedArticles(id: number) {
    return this.httpClient.get(ApiService.baseApi + 'articles/' + id + '/similar');
  }

  logout() {
    return this.httpClient.post(ApiService.baseApi + 'logout', {}, {withCredentials: true})
  }
}
