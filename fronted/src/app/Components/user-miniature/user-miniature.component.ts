import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserResponse } from 'src/app/Interfaces/user';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-miniature',
  templateUrl: './user-miniature.component.html',
  styleUrls: ['./user-miniature.component.scss'],
})
export class UserMiniatureComponent implements OnInit {
  @Input() user: UserResponse | undefined;
  public apiUrl: string = environment.apiUrl;

  constructor() {}

  ngOnInit(): void {}
}
