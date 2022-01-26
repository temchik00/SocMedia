import { HttpClient, HttpParams } from '@angular/common/http';
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
  public userInitialized: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private auth: AuthService,
    private misc: MiscService,
    private httpClient: HttpClient
  ) {
    this.auth.isAuthorized.subscribe(
      async (isAuthorized: boolean | undefined) => {
        if (isAuthorized === true) {
          this.user = await this.getSelf();
          this.userId = this.user.id;
          this.userInitialized.next(true);
          return;
        }
        if (isAuthorized === false) {
          this.user = undefined;
          this.userId = -2;
          this.userInitialized.next(true);
          return;
        }
        this.userInitialized.next(false);
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
    let date: Date | null = null;
    if (userResponse.birth_date != null)
      date = new Date(userResponse.birth_date);
    let user: User = {
      id: userResponse.id,
      first_name: userResponse.first_name,
      last_name: userResponse.last_name,
      birth_date: date,
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
    let avatarLink: string = (
      await this.misc.sendPicture(avatar, this.auth.getTokenHeader())
    ).filename;
    return this.updateSelf({ avatar: avatarLink });
  }

  public async postPublication(
    text: string | undefined,
    image: File | undefined
  ): Promise<void> {
    let body: any = {};
    if (text && text.length > 0) {
      body.content = text;
    }
    if (image) {
      let imageUrl = (
        await this.misc.sendPicture(image, this.auth.getTokenHeader())
      ).filename;
      body.image = imageUrl;
    }
    await firstValueFrom(
      this.httpClient.post(environment.apiUrl + '/publication/', body, {
        headers: this.auth.getTokenHeader(),
      })
    );
  }

  public async filterUsers(
    first_name?: string,
    last_name?: string,
    sex?: number,
    city?: number,
    younger?: number,
    older?: number,
    page_number?: number,
    exclude_user?: number
  ): Promise<UserResponse[]> {
    let params = new HttpParams();
    if (first_name) params = params.set('first_name', first_name);
    if (last_name) params = params.set('last_name', last_name);
    if (sex) params = params.set('sex', sex);
    if (city) params = params.set('city', city);
    if (younger) params = params.set('younger', younger);
    if (older) params = params.set('older', older);
    if (page_number) params = params.set('page_number', page_number);
    if (exclude_user) params = params.set('exclude_user', exclude_user);
    let users: UserResponse[] = await firstValueFrom(
      this.httpClient.get<UserResponse[]>(
        environment.apiUrl + '/user/filter/',
        { params: params }
      )
    );
    return Promise.resolve(users);
  }

  public async hasFriend(friendId: number): Promise<boolean> {
    try {
      await firstValueFrom(
        this.httpClient.get(`${environment.apiUrl}/friend/${friendId}/`, {
          headers: this.auth.getTokenHeader(),
        })
      );
      return Promise.resolve(true);
    } catch (error) {
      return Promise.resolve(false);
    }
  }

  public async addFriend(friendId: number): Promise<void> {
    await firstValueFrom(
      this.httpClient.post(
        `${environment.apiUrl}/friend/${friendId}/`,
        {},
        {
          headers: this.auth.getTokenHeader(),
        }
      )
    );
  }

  public async deleteFriend(friendId: number): Promise<void> {
    await firstValueFrom(
      this.httpClient.delete(`${environment.apiUrl}/friend/${friendId}/`, {
        headers: this.auth.getTokenHeader(),
      })
    );
  }

  public async getFriends(): Promise<UserResponse[]> {
    return firstValueFrom(
      this.httpClient.get<UserResponse[]>(environment.apiUrl + '/friend/all/', {
        headers: this.auth.getTokenHeader(),
      })
    );
  }
}
