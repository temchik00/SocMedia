import { HttpClient, HttpParams } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  firstValueFrom,
  Subject,
  Subscriber,
  Subscription,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Chat, ChatResponse } from '../Interfaces/chat';
import { Message, MessageResponse } from '../Interfaces/message';
import { UserResponse } from '../Interfaces/user';
import { AuthService } from './auth.service';
import { MiscService } from './misc.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private lastMessageSubscriptions: Subscription = new Subscription();
  private chatWebSocket: WebSocketSubject<MessageResponse | any> | undefined =
    undefined;
  private chatSubscription: Subscription = new Subscription();
  public chatOpened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public chatAdded: Subject<Chat> = new Subject<Chat>();
  public messagesChanged: Subject<Message[]> = new Subject<Message[]>();
  public chat: Chat | undefined = undefined;
  public members: UserResponse[] = [];
  public messages: Message[] = [];
  public lastPage: boolean = false;
  public updatingMessages: boolean = false;

  constructor(
    private auth: AuthService,
    private httpClient: HttpClient,
    private misc: MiscService
  ) {}

  private async getChatResponse(chatId: number): Promise<ChatResponse> {
    return firstValueFrom(
      this.httpClient.get<ChatResponse>(
        `${environment.apiUrl}/chat/${chatId}/`,
        { headers: this.auth.getTokenHeader() }
      )
    );
  }

  private async repackMessage(
    messageResponse: MessageResponse
  ): Promise<Message> {
    for (let index = 0; index < this.members.length; index++) {
      if (this.members[index].id == messageResponse.user_id) {
        let message: Message = {
          id: messageResponse.id,
          content: messageResponse.content,
          time_posted: messageResponse.time_posted,
          user: this.members[index],
        };
        return message;
      }
    }
    let member = await firstValueFrom(
      this.httpClient.get<UserResponse>(
        `${environment.apiUrl}/user/${messageResponse.user_id}/`
      )
    );
    this.members.push(member);
    let message: Message = {
      id: messageResponse.id,
      content: messageResponse.content,
      time_posted: messageResponse.time_posted,
      user: member,
    };
    return Promise.resolve(message);
  }

  private async getMessages(chatId: number): Promise<Message[]> {
    this.updatingMessages = true;
    let params = new HttpParams().set('page_size', environment.messagesInPage);
    if (this.messages.length > 0) {
      params = params.set('message_from', this.messages[0].id);
    }
    let messageResponses = await firstValueFrom(
      this.httpClient.get<MessageResponse[]>(
        `${environment.apiUrl}/chat/${chatId}/messages/`,
        { headers: this.auth.getTokenHeader(), params: params }
      )
    );
    if (messageResponses.length < environment.messagesInPage) {
      this.lastPage = true;
    }
    let messages: Message[] = [];
    for (let messageResponse of messageResponses) {
      let message = await this.repackMessage(messageResponse);
      messages.push(message);
    }
    this.updatingMessages = false;
    return Promise.resolve(messages);
  }

  private getChatWebsocket(chatId: number): WebSocketSubject<MessageResponse> {
    return webSocket(
      `${
        environment.websocketUrl
      }/chat/${chatId}/?token=${this.auth.getTokenString()}`
    );
  }

  private async getChat(chatResponse: ChatResponse): Promise<Chat> {
    let lastMessage: Message | undefined = undefined;
    try {
      let lastMessageResponse = await firstValueFrom(
        this.httpClient.get<MessageResponse>(
          `${environment.apiUrl}/chat/${chatResponse.id}/messages/last_message/`,
          { headers: this.auth.getTokenHeader() }
        )
      );
      let member: UserResponse = await firstValueFrom(
        this.httpClient.get<UserResponse>(
          `${environment.apiUrl}/user/${lastMessageResponse.user_id}/`
        )
      );
      lastMessage = {
        id: lastMessageResponse.id,
        user: member,
        content: lastMessageResponse.content,
        time_posted: lastMessageResponse.time_posted,
      };
    } catch {}
    let chat: Chat = {
      id: chatResponse.id,
      image: chatResponse.image,
      name: chatResponse.name,
      lastMessage: lastMessage,
    };
    let webSocket = this.getChatWebsocket(chat.id);
    this.lastMessageSubscriptions.add(
      webSocket.subscribe(async (messageResponse: MessageResponse) => {
        let message = await this.repackMessage(messageResponse);
        chat.lastMessage = message;
      })
    );
    return Promise.resolve(chat);
  }

  public async getMembers(chatId: number): Promise<UserResponse[]> {
    return firstValueFrom(
      this.httpClient.get<UserResponse[]>(
        `${environment.apiUrl}/chat/${chatId}/members/`,
        { headers: this.auth.getTokenHeader() }
      )
    );
  }

  public async getAllChats(): Promise<Chat[]> {
    let chatsResponse: ChatResponse[] = await firstValueFrom(
      this.httpClient.get<ChatResponse[]>(environment.apiUrl + '/chat/all/', {
        headers: this.auth.getTokenHeader(),
      })
    );
    let chats: Chat[] = [];
    for (let chatResponse of chatsResponse) {
      let chat = await this.getChat(chatResponse);
      chats.push(chat);
    }
    return Promise.resolve(chats);
  }

  public async openChat(chat: Chat): Promise<void> {
    if (this.chat) this.closeChat();
    let [chatResponse, members] = await Promise.all([
      this.getChatResponse(chat.id),
      this.getMembers(chat.id),
    ]);
    this.chat = {
      id: chatResponse.id,
      name: chatResponse.name,
      image: chatResponse.image,
      lastMessage: undefined,
    };
    this.members = members;
    this.messages = await this.getMessages(chat.id);
    this.chatOpened.next(true);
    this.messagesChanged.next(this.messages);
    this.chatWebSocket = this.getChatWebsocket(chat.id);
    let subscription = this.chatWebSocket.subscribe(
      async (data: MessageResponse) => {
        let message = await this.repackMessage(data);
        this.messages.push(message);
        this.messagesChanged.next(this.messages);
      }
    );
    this.chatSubscription.add(subscription);
  }

  public sendMessage(message: string): void {
    if (this.chatWebSocket) this.chatWebSocket.next(message);
  }

  public closeChat(): void {
    this.chatSubscription.unsubscribe();
    if (this.chatWebSocket) {
      this.chatWebSocket.complete();
      this.chatWebSocket = undefined;
    }

    this.chat = undefined;
    this.messages = [];
    this.members = [];
    this.lastPage = false;
    this.chatOpened.next(false);
  }

  public async getMoreMessages(): Promise<void> {
    if (!this.lastPage && !this.updatingMessages && this.chat) {
      let messages = await this.getMessages(this.chat.id);
      this.messages = messages.concat(this.messages);
      this.messagesChanged.next(this.messages);
    }
  }

  public closeAll() {
    this.closeChat();
    this.lastMessageSubscriptions.unsubscribe();
  }

  public async createChat(
    name: string,
    avatar: File | undefined
  ): Promise<void> {
    let avatarUrl: string = '';
    if (avatar)
      avatarUrl = (
        await this.misc.sendPicture(avatar, this.auth.getTokenHeader())
      ).filename;
    let chatResponse: ChatResponse = await firstValueFrom(
      this.httpClient.post<ChatResponse>(
        environment.apiUrl + '/chat/',
        { name: name, image: avatarUrl },
        { headers: this.auth.getTokenHeader() }
      )
    );
    let chat: Chat = await this.getChat(chatResponse);
    this.chatAdded.next(chat);
  }

  public async addMembers(memberIds: number[]): Promise<void> {
    if (this.chat) {
      this.httpClient
        .post(
          `${environment.apiUrl}/chat/${this.chat.id}/members/`,
          { user_ids: memberIds },
          { headers: this.auth.getTokenHeader() }
        )
        .subscribe();
      for (let memberId of memberIds) {
        let member: UserResponse = await firstValueFrom(
          this.httpClient.get<UserResponse>(
            `${environment.apiUrl}/user/${memberId}`
          )
        );
        this.members.push(member);
      }
    }
  }
}
