import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(private httpClient: HttpClient) {
  }

  getData() {
    return this.httpClient.get('http://localhost:8000/api/articles');
  }
}
