import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UserDetailsComponent } from './users/user-details/user-details.component';
import { UsersListComponent } from './users/users-list/users-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    UserDetailsComponent,
    UsersListComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'my-users-list';
}
