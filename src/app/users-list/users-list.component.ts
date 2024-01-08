import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { User, UsersService } from '../users.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit {
  users: User[] | undefined;

  constructor(private usersService: UsersService) {}
  ngOnInit(): void {
    this.users = this.usersService._usersList;
  }
}
