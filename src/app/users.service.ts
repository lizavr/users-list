import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of, throwError } from 'rxjs';

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
  private users: User[] = [
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
      surname: 'Dove',
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

  private userSubject: BehaviorSubject<User[]> = new BehaviorSubject(
    this.users
  );

  private delayMs = 0;

  getAllUsers(): Observable<User[]> {
    //asObservable превращает Subject в объект только для чтения
    //(бехэвиор сабджект имеет начальное значение и сразу его получаем при подписке. сабджект-не имеет начального)
    return this.userSubject.asObservable().pipe(delay(this.delayMs));

    // return of(this.users).pipe(delay(this.delayMs));
  }

  getUserById(id: number): Observable<User> {
    const user = this.users.find((us) => us.id === id);
    if (user) {
      return of(user).pipe(delay(this.delayMs));
    } else {
      return throwError(() => new Error('user not found')).pipe(
        delay(this.delayMs)
      );
    }
  }

  addUser(user: User): Observable<User> {
    user.id = Math.max(...this.users.map((user) => user.id)) + 1;
    this.users.push(user);
    this.userSubject.next(this.users);
    return of(user).pipe(delay(this.delayMs));
  }

  updateUser(updatedUser: User): Observable<User> {
    const index = this.users.findIndex((us) => us.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      this.userSubject.next(this.users);
      return of(updatedUser).pipe(delay(this.delayMs));
    } else {
      return throwError(() => new Error('user not found')).pipe(
        delay(this.delayMs)
      );
    }
  }

  deleteUser(id: number): Observable<{}> {
    const index = this.users.findIndex((us) => us.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      this.userSubject.next(this.users);
      return of({}).pipe(delay(this.delayMs));
    } else {
      return throwError(() => new Error('user not found')).pipe(
        delay(this.delayMs)
      );
    }
  }
}
