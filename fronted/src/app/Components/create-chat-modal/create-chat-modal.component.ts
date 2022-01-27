import { Component, OnInit } from '@angular/core';
import { ModalsService } from 'src/app/Shared/modals.service';

@Component({
  selector: 'app-create-chat-modal',
  templateUrl: './create-chat-modal.component.html',
  styleUrls: ['./create-chat-modal.component.scss'],
})
export class CreateChatModalComponent implements OnInit {
  public name: string = '';
  public avatar: File | undefined = undefined;
  private fileInput: HTMLElement | null = null;
  constructor(public modals: ModalsService) {}

  ngOnInit(): void {}

  public createChat() {
    this.fileInput = document.getElementById('fileinput');
    (<HTMLInputElement>this.fileInput).value = '';
    this.modals.createChat(this.name, this.avatar);
    this.modals.closeCreateChat();
  }

  public selectAvatar(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length != 0) {
      this.avatar = files[0];
    } else {
      this.avatar = undefined;
    }
  }
}
