import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Chat } from 'src/app/Interfaces/chat';
import { ChatService } from 'src/app/Shared/chat.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat-miniature',
  templateUrl: './chat-miniature.component.html',
  styleUrls: ['./chat-miniature.component.scss'],
})
export class ChatMiniatureComponent implements OnInit {
  public apiUrl: string = environment.apiUrl;
  @Input() chat: Chat | undefined = undefined;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {}

  public selectChat(): void {
    if (this.chat) {
      this.chatService.openChat(this.chat);
    }
  }
}
