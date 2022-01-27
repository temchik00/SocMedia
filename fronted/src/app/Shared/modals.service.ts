import { Injectable } from '@angular/core';
import { UserResponse } from '../Interfaces/user';
import { ChatService } from './chat.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ModalsService {
  public createVisible: boolean = false;
  public updateVisible: boolean = false;
  public friends: UserResponse[] = [];
  public friendsToAdd: number[] = [];

  constructor(private chat: ChatService, private userService: UserService) {}

  private hasFriendInMembers(
    friend: UserResponse,
    members: UserResponse[]
  ): boolean {
    for (let member of members) {
      if (member.id == friend.id) return true;
    }
    return false;
  }

  public openCreateChat() {
    this.createVisible = true;
  }

  public closeCreateChat() {
    this.createVisible = false;
  }

  public async openUpdateChat() {
    if (this.chat.chat) {
      let friends = await this.userService.getFriends();
      let members = await this.chat.getMembers(this.chat.chat.id);
      this.friends = [];
      this.friendsToAdd = [];
      for (let friend of friends) {
        if (!this.hasFriendInMembers(friend, members)) {
          this.friends.push(friend);
        }
      }
      this.updateVisible = true;
    }
  }

  public addFriend(friendId: number): void {
    this.friendsToAdd.push(friendId);
  }

  public removeFriend(friendId: number): void {
    let index = this.friendsToAdd.indexOf(friendId);
    this.friendsToAdd.splice(index, 1);
  }

  public closeDispatchUpdateChat(): void {
    if (this.friendsToAdd.length > 0) {
      this.chat.addMembers(this.friendsToAdd);
    }
    this.closeUpdateChat();
  }

  public closeUpdateChat(): void {
    this.updateVisible = false;
    this.friendsToAdd = [];
    this.friends = [];
  }

  public createChat(name: string, avatar: File | undefined): void {
    this.chat.createChat(name, avatar);
  }
}
