import { Component, OnDestroy, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { User, UsersService } from '../../users.service';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: User[] | undefined;
  userSubscription: Subscription | undefined;

  constructor(private usersService: UsersService) {}
  ngOnInit(): void {
    this.userSubscription = this.usersService
      .getAllUsers()
      .subscribe((usersArray) => (this.users = usersArray));
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
