import { Component, OnInit } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { map, throttleTime, distinctUntilChanged } from 'rxjs/operators';
import { City } from 'src/app/Interfaces/city';
import { Sex } from 'src/app/Interfaces/sex';
import { UserResponse } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/Shared/auth.service';
import { MiscService } from 'src/app/Shared/misc.service';
import { UserService } from 'src/app/Shared/user.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
})
export class PeopleComponent implements OnInit {
  private scrollSubscription: Subscription | undefined;
  private loadingData: boolean = false;

  private userId: number | undefined = undefined;
  private pageNum: number = 0;
  private lastPage: boolean = false;
  public users: UserResponse[] = [];
  public cities: City[] = [];
  public sexes: Sex[] = [];

  public sex: Sex | null = null;
  public city: City | null = null;
  public firstName: string = '';
  public lastName: string = '';
  public younger: string = '';
  public older: string = '';

  public filterSex: Sex | null = null;
  public filterCity: City | null = null;
  public filterFirstName: string | undefined = undefined;
  public filterLastName: string | undefined = undefined;
  public filterYounger: number | undefined = undefined;
  public filterOlder: number | undefined = undefined;
  constructor(
    private userService: UserService,
    private misc: MiscService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.isAuthorized.subscribe(
      async (isAuthorized: boolean | undefined) => {
        if (isAuthorized != undefined) {
          if (isAuthorized === true)
            this.userId = (await this.userService.getSelf()).id;
          this.applyFilter();
        }
      }
    );
    this.misc.getCities().then((cities: City[]) => {
      this.cities = cities;
    });
    this.misc.getSexes().then((sexes: Sex[]) => {
      this.sexes = sexes;
    });

    this.scrollSubscription = fromEvent(window, 'scroll')
      .pipe(
        throttleTime(100),
        map(() => window.scrollY),
        map((currY) => this.shouldUpdate(currY)),
        distinctUntilChanged(),
        map((shouldFilter) => this.shouldUpdateUsers(shouldFilter))
      )
      .subscribe();
  }

  private shouldUpdate(currY: any): boolean {
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    return height - currY < 300 && !this.loadingData && !this.lastPage;
  }

  private filterUsers(): void {
    if (!this.loadingData && !this.lastPage) {
      this.loadingData = true;
      this.userService
        .filterUsers(
          this.filterFirstName,
          this.filterLastName,
          this.filterSex?.id,
          this.filterCity?.id,
          this.filterYounger,
          this.filterOlder,
          this.pageNum,
          this.userId
        )
        .then((users: UserResponse[]) => {
          this.users = this.users.concat(users);
          if (users.length === 42) this.pageNum += 1;
          else this.lastPage = true;
          this.loadingData = false;
        });
    }
  }

  private shouldUpdateUsers(should: boolean): void {
    if (should) {
      this.filterUsers();
    }
  }

  public applyFilter(): void {
    this.filterFirstName = this.firstName;
    this.filterLastName = this.lastName;
    this.filterSex = this.sex;
    this.filterCity = this.city;
    this.filterYounger = +this.younger;
    this.filterOlder = +this.older;
    this.lastPage = false;
    this.pageNum = 0;
    this.users = [];
    this.filterUsers();
  }

  ngOnDestroy() {
    if (this.scrollSubscription) this.scrollSubscription.unsubscribe();
  }
}
