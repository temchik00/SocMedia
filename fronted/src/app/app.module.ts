import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './Components/auth/auth.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { ChatComponent } from './Components/chat/chat.component';
import { LeftMenuComponent } from './Components/left-menu/left-menu.component';
import { PublicationComponent } from './Components/publication/publication.component';
import { DropdownSelectComponent } from './Components/dropdown-select/dropdown-select.component';

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
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
