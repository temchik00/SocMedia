import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../Interfaces/user';
import { Publication } from '../../Interfaces/publication';
import { PublicationService } from '../../Shared/publication.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/Shared/user.service';
import { AuthService } from 'src/app/Shared/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.scss'],
})
export class PublicationComponent implements OnInit {
  @Input() publication: Publication | undefined = undefined;
  @Input() user: User = {
    id: -1,
    first_name: '',
    last_name: '',
    birth_date: null,
    phone: '',
    sex: null,
    city: null,
    avatar: '',
  };
  public likes: number[] = [];
  public isLiked: boolean = false;
  public apiUrl: string = environment.apiUrl;
  constructor(
    private publicationService: PublicationService,
    private authService: AuthService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.getLikes();
    this.userService.userInitialized.subscribe((initialized: boolean) => {
      if (initialized) {
        this.isLiked =
          this.likes.includes(this.userService.userId) &&
          this.userService.userId >= 0;
      }
    });
  }

  private getLikes(): void {
    if (this.publication)
      this.publicationService
        .getLikes(this.publication.id)
        .then((likes: number[]) => {
          this.likes = likes;
          this.isLiked =
            this.likes.includes(this.userService.userId) &&
            this.userService.userId >= 0;
        });
  }

  public async toggleLike(): Promise<void> {
    if (this.authService.isAuthorized.value && this.publication) {
      await this.publicationService.toggleLike(
        this.publication.id,
        this.authService.getTokenHeader()
      );
      this.getLikes();
    }
  }
}
