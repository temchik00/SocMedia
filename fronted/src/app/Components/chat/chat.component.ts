import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Chat } from 'src/app/Interfaces/chat';
import { AuthService } from 'src/app/Shared/auth.service';
import { ChatService } from 'src/app/Shared/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  public chats: Chat[] = [];
  constructor(
    private router: Router,
    private auth: AuthService,
    public chatService: ChatService
  ) {}

  ngOnInit(): void {
    let subscription = this.chatService.chatAdded.subscribe((chat: Chat) => {
      this.chats.push(chat);
    });
    this.subscriptions.add(subscription);
    subscription = this.auth.isAuthorized.subscribe(
      (isAuthorized: boolean | undefined) => {
        if (isAuthorized === false) {
          this.router.navigate(['/registration']);
        }
        if (isAuthorized === true) {
          this.getChats();
        }
      }
    );
    this.subscriptions.add(subscription);
  }

  public getChats(): void {
    this.chatService.getAllChats().then((chats: Chat[]) => {
      this.chats = chats;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.chatService.closeAll();
  }
}
