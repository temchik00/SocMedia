import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Shared/auth.service';
import { UserService } from 'src/app/Shared/user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  public registrationEmail: string = '';
  public registrationPassword: string = '';
  public registrationRepeatPassword: string = '';
  public authLogin: string = '';
  public authPassword: string = '';

  public firstName: string = '';
  public lastName: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isAuthorized.subscribe((isAuth: boolean | undefined) => {
      if (isAuth === true) {
        this.router.navigate(['/profile']);
      }
    });
  }

  public register(): void {
    this.authService.createAccount(
      this.firstName,
      this.lastName,
      this.registrationEmail,
      this.registrationPassword
    );
  }

  public login(): void {
    this.authService.logIn(this.authLogin, this.authPassword);
  }
}
