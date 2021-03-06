import { AuthUser } from './../models/auth-user';
import { User } from './../models/user';
import { HttpService } from './http';
import { AuthActions } from './../actions/auth.actions';
import { AppState } from './../../app.state';
import { Store } from '@ngrx/store';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Router } from '@angular/router';
import { AuthService as SocialAuth } from 'ng2-ui-auth';

@Injectable()
export class AuthService {

  modalShow$: Subject<boolean> = new Subject();

  constructor(
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private store: Store<AppState>,
    private authActions: AuthActions,
    private router: Router,
    private socialAuth: SocialAuth,
    private http: HttpService
  ) {
    this.toastyConfig.theme = 'bootstrap';
    this.validateToken().subscribe();
  }


  validateToken(): Observable<any> {
    const headerDict = {
      'x-access-token': localStorage.getItem('accessToken')
    }

    return this.http.get(
      `/api/validate_token`
    , {params: headerDict}).do(
      (res) => {
        if (res.status === 200) {
          const data: AuthUser = res.json();
          console.log(data);
          this.store.dispatch(this.authActions.loginSuccess(data));
        }
      },
      (err) => {
        console.log('error', err);
      });
  }

  logOutUser() {
    localStorage.clear();
    this.store.dispatch(this.authActions.logoutSuccess());
    this.router.navigate(['/']);
  }

  registerUser(signUpData) {
    console.log(signUpData);
    this.http.post(
      '/api/register', { user: signUpData }
    ).subscribe((res: Response) => {
      const data = res.json();
      if (data.error) {
        const message = 'Email' + data.error.email[0];
        this.toastyService.error(message);
      } else {

        const message = data.message;
        this.modalShow$.next(false);
        this.toastyService.success(message);
      }
    }, (error) => { });
  }

  logInUser(signInData) {
    this.http.post(
      '/api/login', { credentials: signInData }
    ).subscribe((res: Response) => {
      const data = res.json();
      if (data.error) {
        const message = data.message;
        this.toastyService.error(message);
      } else {
        this.store.dispatch(this.authActions.loginSuccess(data));
        this.modalShow$.next(false);
        this.toastyService.success('Ingreso Correcto');
        this.setTokenInLocalStorage(data.authorization);
      }
    });
  }

  socialLogin(provider: string) {
    return this.socialAuth.authenticate(provider).subscribe((res: Response) => {
      const data: AuthUser = res.json();
      this.store.dispatch(this.authActions.loginSuccess(data));
      this.modalShow$.next(false);
      this.setTokenInLocalStorage(res.headers.toJSON());
    });
  }

  setTokenInLocalStorage(headers) {
    const token = headers;
    localStorage.setItem('accessToken', token);
  }

}
