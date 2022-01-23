import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User, UserResponse } from '../Interfaces/user';
import { AuthService } from './auth.service';
import { MiscService } from './misc.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: User | undefined;
  public userId: number = -2;

  constructor(
    private auth: AuthService,
    private misc: MiscService,
    private httpClient: HttpClient
  ) {
    this.auth.isAuthorzed.subscribe(
      async (isAuthorized: boolean | undefined) => {
        if (isAuthorized === true) {
          this.user = await this.getSelf();
          this.userId = this.user.id;
        }
        if (isAuthorized === false) {
          this.user = undefined;
          this.userId = -2;
        }
      }
    );
  }

  private async getUserFromToken(): Promise<UserResponse> {
    return firstValueFrom(
      this.httpClient.get<UserResponse>(environment.apiUrl + '/user/', {
        headers: this.auth.getTokenHeader(),
      })
    );
  }

  private async getUserFromId(userId: number): Promise<UserResponse> {
    return firstValueFrom(
      this.httpClient.get<UserResponse>(`${environment.apiUrl}/user/${userId}/`)
    );
  }

  private unpackUserResponse(userResponse: UserResponse): User {
    let user: User = {
      id: userResponse.id,
      first_name: userResponse.first_name,
      last_name: userResponse.last_name,
      birth_date: userResponse.birth_date,
      phone: userResponse.phone,
      sex: null,
      city: null,
      avatar: userResponse.avatar,
    };
    return user;
  }

  private async getUserInfo(userResponse: UserResponse): Promise<User> {
    let user: User = this.unpackUserResponse(userResponse);
    if (userResponse.city != null) {
      user.city = await this.misc.getCity(userResponse.city);
    }

    if (userResponse.sex != null) {
      user.sex = await this.misc.getSex(userResponse.sex);
    }
    return Promise.resolve(user);
  }

  public async getSelf(): Promise<User> {
    let userInfo: UserResponse = await this.getUserFromToken();
    let user = await this.getUserInfo(userInfo);
    return Promise.resolve(user);
  }

  public async getUser(userId: number): Promise<User> {
    let userInfo: UserResponse = await this.getUserFromId(userId);
    let user = await this.getUserInfo(userInfo);
    return Promise.resolve(user);
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

  public async updateAvatar(avatar: File): Promise<UserResponse> {
    let avatarLink: string = await (
      await this.misc.sendPicture(avatar, this.auth.getTokenHeader())
    ).filename;
    return this.updateSelf({ avatar: avatarLink });
  }
}
