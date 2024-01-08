import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { UserDetailsComponent } from './users/user-details/user-details.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UsersComponent } from './users/users.component';
import { userExistsGuard } from './user-exists.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  {
    path: 'users',
    component: UsersComponent,
    children: [{ path: ':id', component: UserDetailsComponent, canActivate: [userExistsGuard] }],
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' },
];
