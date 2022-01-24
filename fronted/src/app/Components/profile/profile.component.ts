import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { City } from 'src/app/Interfaces/city';
import { Publication } from 'src/app/Interfaces/publication';
import { Sex } from 'src/app/Interfaces/sex';
import { AuthService } from 'src/app/Shared/auth.service';
import { MiscService } from 'src/app/Shared/misc.service';
import { PublicationService } from 'src/app/Shared/publication.service';
import { UserService } from 'src/app/Shared/user.service';
import { environment } from 'src/environments/environment';
import { User } from '../../Interfaces/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public user: User = {
    id: -1,
    first_name: '',
    last_name: '',
    birth_date: null,
    phone: '',
    sex: null,
    city: null,
    avatar: '',
  };
  public isRedacting: boolean = false;
  public cities: City[] = [];
  public sexes: Sex[] = [];
  public avatar: File | undefined = undefined;
  public apiUrl: string = environment.apiUrl;

  public publicationText: string = '';
  public publicationImage: File | undefined;
  public publicationImageUrl: string | undefined;

  public publications: Publication[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private misc: MiscService,
    private auth: AuthService,
    private publicationService: PublicationService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(async (params: ParamMap) => {
      if (!params.has('id')) {
        await this.redirectFromNoId(this.auth.isAuthorzed.value);
      } else {
        let id = +(<string>params.get('id'));
        this.user = await this.userService.getUser(id);
        this.publications = await this.publicationService.getPublications(id);
      }
    });
    this.misc.getCities().then((cities: City[]) => {
      this.cities = cities;
    });
    this.misc.getSexes().then((sexes: Sex[]) => {
      this.sexes = sexes;
    });
  }

  private redirectToUserPage(id: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: id },
      queryParamsHandling: 'merge',
    });
  }

  private redirectToOwnPage(): void {
    if (this.user.id != -1) {
      this.redirectToUserPage(this.user.id);
    }
  }

  private async redirectFromNoId(
    isAuthorized: boolean | undefined
  ): Promise<void> {
    if (isAuthorized === true) {
      this.user = await this.userService.getSelf();
      this.redirectToOwnPage();
      return;
    }
    if (isAuthorized === false) {
      this.router.navigate(['/registration']);
      return;
    }
    let isAuthed = await firstValueFrom(this.auth.isAuthorzed);
    await this.redirectFromNoId(isAuthed);
    return;
  }

  public redact(): void {
    this.isRedacting = true;
  }

  public async saveUserChanges(): Promise<void> {
    let data: any = {};
    if (this.user.city != null) {
      data.city = this.user.city.id;
    }
    if (this.user.sex != null) {
      data.sex = this.user.sex.id;
    }
    if (this.user.phone === null || this.user.phone.length === 0) {
      data.phone = null;
    } else {
      data.phone = this.user.phone;
    }
    if (
      this.user.birth_date != null &&
      !isNaN(Date.parse(<string>(<any>this.user.birth_date)))
    ) {
      data.birth_date = this.user.birth_date;
    }
    await this.userService.updateSelf(data);
    let params = this.route.snapshot.queryParamMap;
    let id = +(<string>params.get('id'));
    this.user = await this.userService.getUser(id);
    this.isRedacting = false;
  }

  public async revertUserChanges(): Promise<void> {
    let params = this.route.snapshot.queryParamMap;
    let id = +(<string>params.get('id'));
    this.user = await this.userService.getUser(id);
    this.isRedacting = false;
  }

  public selectAvatar(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length != 0) {
      this.avatar = files[0];
    } else {
      this.avatar = undefined;
    }
  }

  public async updateAvatar(): Promise<void> {
    if (this.avatar) {
      await this.userService.updateAvatar(this.avatar);
      let params = this.route.snapshot.queryParamMap;
      let id = +(<string>params.get('id'));
      this.user = await this.userService.getUser(id);
      this.avatar = undefined;
    }
  }

  public uploadImage(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length != 0) {
      this.publicationImage = files[0];
      let reader = new FileReader();
      reader.readAsDataURL(this.publicationImage);
      reader.onload = (_event: any) => {
        this.publicationImageUrl = <string>reader.result;
      };
    } else {
      this.publicationImage = undefined;
      this.publicationImageUrl = undefined;
    }
  }

  public removeImage(): void {
    this.publicationImage = undefined;
    this.publicationImageUrl = undefined;
  }

  public async postPublication(): Promise<void> {
    if (
      (this.publicationText && this.publicationText.length > 0) ||
      this.publicationImage
    ) {
      await this.userService.postPublication(
        this.publicationText,
        this.publicationImage
      );
      this.publicationText = '';
      this.publicationImage = undefined;
      this.publicationImageUrl = undefined;
      let params = this.route.snapshot.queryParamMap;
      let id = +(<string>params.get('id'));
      this.publications = await this.publicationService.getPublications(id);
    }
  }
}
