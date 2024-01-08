import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ RouterOutlet, UsersListComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

}
