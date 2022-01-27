import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

interface TokenData {
  access_token: string;
  token_type: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenLifetime: number = 3600;
  private email: string | undefined;
  private password: string | undefined;
  private accessToken: string | undefined;
  private refreshSubscription: any | undefined;
  public isAuthorized: BehaviorSubject<boolean | undefined> =
    new BehaviorSubject<boolean | undefined>(undefined);

  constructor(private httpClient: HttpClient, private cookie: CookieService) {
    if (cookie.check('email') && cookie.check('password')) {
      let email = cookie.get('email');
      let password = cookie.get('password');
      this.logIn(email, password);
    } else {
      this.isAuthorized.next(false);
    }
  }

  private async getToken(email: string, password: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      let formdata = new FormData();
      formdata.append('username', email);
      formdata.append('password', password);
      try {
        let tokens: TokenData = await firstValueFrom(
          this.httpClient.post<TokenData>(
            environment.apiUrl + '/user/sign_in/',
            formdata
          )
        );
        resolve(tokens.access_token);
      } catch (error) {
        reject(error);
      }
    });
  }

  private async authorize(): Promise<boolean> {
    if (this.email != undefined && this.password != undefined) {
      try {
        let token = await this.getToken(this.email, this.password);
        this.accessToken = token;
        return Promise.resolve(true);
      } catch {
        this.logOut();
        return Promise.resolve(false);
      }
    } else {
      this.logOut();
      return Promise.resolve(false);
    }
  }

  public async logIn(email: string, password: string): Promise<void> {
    this.email = email;
    this.password = password;
    let result = await this.authorize();
    if (result) {
      this.cookie.set('email', email, undefined, '/');
      this.cookie.set('password', password, undefined, '/');
      this.isAuthorized.next(true);
      this.refreshSubscription = setInterval(() => {
        this.authorize();
      }, this.tokenLifetime * 0.9 * 1000);
    }
  }

  public logOut(): void {
    this.email = undefined;
    this.password = undefined;
    this.accessToken = undefined;
    this.isAuthorized.next(false);
    if (this.cookie.check('email')) this.cookie.delete('email');
    if (this.cookie.check('password')) this.cookie.delete('password');
    if (this.refreshSubscription != undefined) {
      clearInterval(this.refreshSubscription);
      this.refreshSubscription = undefined;
    }
  }

  public createAccount(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): void {
    firstValueFrom(
      this.httpClient.post<TokenData>(environment.apiUrl + '/user/sign_up/', {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      })
    )
      .then((tokens: TokenData) => {
        this.email = email;
        this.password = password;
        this.accessToken = tokens.access_token;
        this.isAuthorized.next(true);
        this.refreshSubscription = setInterval(() => {
          this.authorize();
        }, this.tokenLifetime * 0.9 * 1000);
      })
      .catch((error: any) => {
        console.error(error);
        this.logOut();
      });
  }

  public getTokenHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken);
  }

  public getTokenString(): string {
    return <string>this.accessToken;
  }
}
