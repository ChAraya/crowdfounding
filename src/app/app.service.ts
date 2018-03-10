import { ToastyService } from 'ng2-toasty';
import {
  Http,
  ConnectionBackend,
  RequestOptions,
  RequestOptionsArgs,
  Response,
  Headers,
  Request
} from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';

@Injectable()
export class AppService {

  constructor(private http: Http) { }

  confirmEmail(token) {
    return this.http.post(
      environment.API_ENDPOINT + `/api/confirm_email/`,
      {token}
    ).map(res => {
      return res.json();
    });
  }
}
