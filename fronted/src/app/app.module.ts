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
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'ru' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
