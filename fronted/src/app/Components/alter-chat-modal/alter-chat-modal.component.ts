import { Component, OnInit } from '@angular/core';
import { ModalsService } from 'src/app/Shared/modals.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-alter-chat-modal',
  templateUrl: './alter-chat-modal.component.html',
  styleUrls: ['./alter-chat-modal.component.scss'],
})
export class AlterChatModalComponent implements OnInit {
  public apiUrl: string = environment.apiUrl;
  constructor(public modals: ModalsService) {}

  ngOnInit(): void {}
}
