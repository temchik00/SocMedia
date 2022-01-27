import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/Interfaces/message';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-message-miniature',
  templateUrl: './message-miniature.component.html',
  styleUrls: ['./message-miniature.component.scss'],
})
export class MessageMiniatureComponent implements OnInit {
  public apiUrl: string = environment.apiUrl;
  @Input() message: Message | undefined = undefined;

  constructor() {}

  ngOnInit(): void {}
}
