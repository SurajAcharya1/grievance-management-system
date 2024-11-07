import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {EMPTY, Observable} from "rxjs";
import {LocalStorageUtil} from "./localStorageUtil";
import {TimeoutComponent} from "./app/timeout/timeout.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Injectable} from "@angular/core";
import {ApiService} from "./apiService";
import {Router} from "@angular/router";
import {environment} from "./environments/environment";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private modal: NgbModal,
              private apiService: ApiService,
              private router: Router) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url !== `${environment.baseApi}login` &&
        req.url !== `${environment.baseApi}logout` &&
        req.url !== `${environment.baseApi}register` &&
        req.url !== `${environment.baseApi}forgot-password` &&
        req.url !== `${environment.baseApi}reset-password`) {
        const expDate = new Date(LocalStorageUtil.getStorage()?.exp).getTime();
        const currDate = new Date().getTime();
        if (expDate < currDate) {
          if (!this.apiService.timeoutPopupActive) {
            this.modal.open(TimeoutComponent).result.then(
              (result) => {
                this.checkExpiryAndNavigate();
              },
              (reason) => {
                this.checkExpiryAndNavigate();
              }
            );
            }
          // return EMPTY;
          return next.handle(req);
        } else {
          return next.handle(req);
        }
    } else {
        return next.handle(req);
    }
  }

  checkExpiryAndNavigate() {
    this.apiService.timeoutPopupActive = false;
    this.apiService.reLoginComplete.subscribe(res => {
      if (res) {
        const expDate = new Date(LocalStorageUtil.getStorage()?.exp).getTime();
        const currDate = new Date().getTime();
        if (expDate > currDate) {
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/temporary', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        }
      }
    })
  }

}
