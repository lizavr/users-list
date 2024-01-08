import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UsersService } from './users.service';

export const userExistsGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const userService = inject(UsersService);
  const router = inject(Router);
  const param = route.params['id'];
  if (param === 'new') {
    return true;
  }
  const id = +param;

  return userService.getUserById(id).pipe(
    map((item) => {
      if (item) {
        return true;
      } else {
        router.navigate(['not-found']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['not-found']);
      return of(false);
    })
  );
};
