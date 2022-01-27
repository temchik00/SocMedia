import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  AfterViewInit,
  ViewChildren,
  QueryList,
} from '@angular/core';
import {
  distinctUntilChanged,
  firstValueFrom,
  fromEvent,
  map,
  Subscription,
  throttleTime,
} from 'rxjs';
import { Chat } from 'src/app/Interfaces/chat';
import { Message } from 'src/app/Interfaces/message';
import { ChatService } from 'src/app/Shared/chat.service';
import { ModalsService } from 'src/app/Shared/modals.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat-viewer',
  templateUrl: './chat-viewer.component.html',
  styleUrls: ['./chat-viewer.component.scss'],
})
export class ChatViewerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('messagesContainer') scrollContainer!: QueryList<ElementRef>;
  private subscriptions: Subscription = new Subscription();
  public chat: Chat | undefined = undefined;
  public messages: Message[] = [];
  public apiUrl: string = environment.apiUrl;

  public messageText: string = '';
  constructor(public chatService: ChatService, public modals: ModalsService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.chatService.chatOpened.subscribe((isOpened: boolean) => {
        if (isOpened) {
          this.chat = this.chatService.chat;
        }
      })
    );
    this.subscriptions.add(
      this.chatService.messagesChanged.subscribe((messages: Message[]) => {
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
        this.messages = messages;
      })
    );
  }

  ngAfterViewInit(): void {
    firstValueFrom(this.scrollContainer.changes).then((item) => {
      if (this.scrollContainer.length) {
        this.forceScrollToBottom();
        let nativeElement = this.scrollContainer.first.nativeElement;
        this.subscriptions.add(
          fromEvent(nativeElement, 'scroll')
            .pipe(
              throttleTime(50),
              map((event) => this.getScrollPosition(event)),
              map((currY) => this.shouldGetMessages(currY)),
              distinctUntilChanged(),
              map((shouldFilter) => this.shouldUpdateMessages(shouldFilter))
            )
            .subscribe()
        );
      }
    });
  }

  private getScrollPosition(event: any): number {
    return <number>event.target.scrollTop;
  }

  private shouldGetMessages(currY: number): boolean {
    return (
      currY < 50 &&
      !this.chatService.lastPage &&
      !this.chatService.updatingMessages
    );
  }

  private scrollToBottom(): void {
    try {
      let element = this.scrollContainer.first.nativeElement;
      if (element.scrollHeight - element.scrollTop < 150)
        element.scrollTop = element.scrollHeight;
    } catch (err) {}
  }

  private forceScrollToBottom(): void {
    try {
      let element = this.scrollContainer.first.nativeElement;
      element.scrollTop = element.scrollHeight;
    } catch (err) {}
  }

  private shouldUpdateMessages(shouldUpdate: boolean): void {
    if (shouldUpdate) {
      this.chatService.getMoreMessages();
    }
  }

  public sendMessage(): void {
    this.forceScrollToBottom();
    this.chatService.sendMessage(this.messageText);
    this.messageText = '';
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.chatService.closeChat();
  }
}
