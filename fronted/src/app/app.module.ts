import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './Components/auth/auth.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { ChatComponent } from './Components/chat/chat.component';
import { LeftMenuComponent } from './Components/left-menu/left-menu.component';
import { PublicationComponent } from './Components/publication/publication.component';
import { DropdownSelectComponent } from './Components/dropdown-select/dropdown-select.component';
import { FriendsComponent } from './Components/friends/friends.component';
import { PeopleComponent } from './Components/people/people.component';
import { UserMiniatureComponent } from './Components/user-miniature/user-miniature.component';
import { ChatSelectorComponent } from './Components/chat-selector/chat-selector.component';
import { ChatMiniatureComponent } from './Components/chat-miniature/chat-miniature.component';
import { MessageMiniatureComponent } from './Components/message-miniature/message-miniature.component';
import { ChatViewerComponent } from './Components/chat-viewer/chat-viewer.component';
import { MessageComponent } from './Components/message/message.component';
import { CreateChatModalComponent } from './Components/create-chat-modal/create-chat-modal.component';
import { AlterChatModalComponent } from './Components/alter-chat-modal/alter-chat-modal.component';

registerLocaleData(localeRu, 'ru');

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ProfileComponent,
    ChatComponent,
    LeftMenuComponent,
    PublicationComponent,
    DropdownSelectComponent,
    FriendsComponent,
    PeopleComponent,
    UserMiniatureComponent,
    ChatSelectorComponent,
    ChatMiniatureComponent,
    MessageMiniatureComponent,
    ChatViewerComponent,
    MessageComponent,
    CreateChatModalComponent,
    AlterChatModalComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'ru' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
