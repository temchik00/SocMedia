import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/Interfaces/message';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  public apiUrl: string = environment.apiUrl;
  @Input() message: Message | undefined = undefined;
  @Input() fromMe: boolean = true;

  constructor() {}

  ngOnInit(): void {}
}
