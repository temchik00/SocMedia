import { Component, Input, OnInit } from '@angular/core';
import { Chat } from 'src/app/Interfaces/chat';
import { ChatService } from 'src/app/Shared/chat.service';
import { ModalsService } from 'src/app/Shared/modals.service';

@Component({
  selector: 'app-chat-selector',
  templateUrl: './chat-selector.component.html',
  styleUrls: ['./chat-selector.component.scss'],
})
export class ChatSelectorComponent implements OnInit {
  @Input() chats: Chat[] = [];

  constructor(public chatService: ChatService, public modals: ModalsService) {}

  ngOnInit(): void {}
}
