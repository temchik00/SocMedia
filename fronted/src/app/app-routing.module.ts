import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './Components/auth/auth.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { ChatComponent } from './Components/chat/chat.component';

const routes: Routes = [
  {
    component: ProfileComponent,
    path: 'profile',
  },
  {
    component: ChatComponent,
    path: 'chat',
  },
  {
    component: AuthComponent,
    path: 'registration',
  },
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: 'profile',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
