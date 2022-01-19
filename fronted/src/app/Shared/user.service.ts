import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User, UserResponse } from '../Interfaces/user';
import { AuthService } from './auth.service';
import { MiscService } from './misc.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public user: User | undefined;
  public initializedUser: Subject<void> = new Subject<void>();

  constructor(
    private auth: AuthService,
    private misc: MiscService,
    private httpClient: HttpClient
  ) {
    this.auth.isAuthorzed.subscribe((isAuth: boolean | undefined) => {
      if (isAuth === true) {
        this.getSelfInfo();
      }
    });
  }

  private async getUser(): Promise<UserResponse> {
    return firstValueFrom(
      this.httpClient.get<UserResponse>(environment.apiUrl + '/user/', {
        headers: this.auth.getTokenHeader(),
      })
    );
  }

  public async getSelfInfo(): Promise<void> {
    let userInfo: UserResponse = await this.getUser();
    let user: User = {
      id: userInfo.id,
      first_name: userInfo.first_name,
      second_name: userInfo.second_name,
      birth_date: userInfo.birth_date,
      phone: userInfo.phone,
      sex: undefined,
      city: undefined,
    };

    if (userInfo.city != undefined) {
      user.city = await this.misc.getCity(userInfo.city);
    }

    if (userInfo.sex != undefined) {
      user.sex = await this.misc.getSex(userInfo.sex);
    }
    this.initializedUser.next();
  }

  public updateSelf(userInfo: Object): Promise<UserResponse> {
    return firstValueFrom(
      this.httpClient.patch<UserResponse>(
        environment.apiUrl + '/user/',
        userInfo,
        {
          headers: this.auth.getTokenHeader(),
        }
      )
    );
  }
}
