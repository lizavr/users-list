import { Injectable } from '@angular/core';

export interface User {
  id: number;
  name: string;
  surname: string;
  country: string;
  phone: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  usersList: User[] = [
    {
      id: 1,
      name: 'John',
      surname: 'Doe',
      country: 'USA',
      phone: '+1234567890',
    },
    {
      id: 2,
      name: 'Jane',
      surname: 'Doe',
      country: 'Canada',
      phone: '+2345678901',
    },
    {
      id: 3,
      name: 'Jim',
      surname: 'Beam',
      country: 'UK',
      phone: '+3456789012',
    },
  ];

  get _usersList(): User[] {
    return this.usersList;
  }
}
