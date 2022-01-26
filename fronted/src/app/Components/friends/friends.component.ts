import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponse } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/Shared/auth.service';
import { UserService } from 'src/app/Shared/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit {
  public friends: UserResponse[] = [];
  public apiUrl = environment.apiUrl;
  constructor(
    private auth: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.userInitialized.subscribe((isInitialized: boolean) => {
      if (isInitialized) {
        if (!this.auth.isAuthorized.value)
          this.router.navigate(['/registration']);
        else this.getFriends();
      }
    });
  }

  private getFriends(): void {
    this.userService.getFriends().then((friends: UserResponse[]) => {
      this.friends = friends;
    });
  }

  public removeFriend(friend_id: number): void {
    this.userService.deleteFriend(friend_id).then(() => {
      this.getFriends();
    });
  }
}
