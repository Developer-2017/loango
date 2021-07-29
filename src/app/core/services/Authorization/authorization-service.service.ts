import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { EMPTY } from 'rxjs';
import { BaseResponseModel } from '../../data-models/base_response.model';

import { DashboardMenu } from '../../data-models/dashboard-menu/dashbord-menu';
import {
  GET_MENU_DASHBOARD_ENDPOINT,
  VALIDATE_USER_LOGIN,
} from '../../constants';
import { UserData } from '../../data-models/auth-response';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private router:Router,
    private toastrService: ToastrService,
    private httpClient: HttpClient)
    { }



  logoutUser() {
    localStorage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  authenticateUser(
    user_email_elm: string,
    user_pass_elm: string,
    user_auth_code: string
  ): Observable<{ userData: UserData; allMenus: DashboardMenu[] }> {
    return forkJoin([
      this.loginUser(user_email_elm, user_pass_elm, user_auth_code),
      this.getAllDashboardMenus(),
    ]).pipe(
      map((data) => {
        return { userData: data[0], allMenus: data[1] };
      })
    );
  }
  private loginUser(
    user_email_elm: string,
    user_pass_elm: string,
    user_auth_code: string
  ): Observable<UserData> {
    return this.httpClient
      .post<BaseResponseModel>(VALIDATE_USER_LOGIN, {
        user_login_elm:user_email_elm,
        user_pass_elm,
        user_auth_code,
      })
      .pipe(map((data) => data.responseData?.data as UserData));
  }
  private getAllDashboardMenus(): Observable<DashboardMenu[]> {
    return this.httpClient
      .get<BaseResponseModel>(GET_MENU_DASHBOARD_ENDPOINT)
      .pipe(map((data) => data.responseData?.data as DashboardMenu[]));
  }

  
}
