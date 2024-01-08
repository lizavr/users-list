import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UsersService } from '../../users.service';
import { Subscription } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, MatAutocompleteModule, ReactiveFormsModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent {
  user: User | undefined;
  subscription: Subscription | undefined;
  editForm: FormGroup;
  countries: string[] = ['Belarus', 'Bulgaria', 'Georgia', 'Russia'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService,
    private formBuilder: FormBuilder
  ) {
    this.editForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      surname: ['', [Validators.required, Validators.minLength(3)]],
      country: [''],
      phone: [''],
      addresses: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      const param = params['id'];
      if (param === 'new') {
        this.initializeUser(this.createDefaultUser());
        return;
      }
      const id = +params['id'];
      this.userService.getUserById(id).subscribe({
        next: (user) => {
          this.initializeUser(user);
        },
        error: (error) => {
          console.error('Error fetching item:', error);
        },
      });
    });
  }

  createDefaultUser(): User {
    return { id: 0, name: '', surname: '', country: '', phone: '' };
  }

  initializeUser(user: User) {
    this.user = user;
    this.initializeForm(user);
  }

  initializeForm(user: User) {
    this.editForm = this.formBuilder.group({
      username: [user?.name, [Validators.required, Validators.minLength(3)]],
      surname: [user?.surname, [Validators.required, Validators.minLength(3)]],
      country: [user?.country],
      phone: [user?.phone],
      addresses: this.formBuilder.array([])
    });
  }

  onSubmit() {
    if (this.editForm.valid) {
      const formData = this.editForm.value;

      const user: User = {
        id: this.user?.id ?? 0,
        name: formData.username,
        surname: formData.surname,
        country: formData.country,
        phone: formData.phone,
      };

      if (user.id) {
        this.updateUser(user);
      } else {
        this.addUser(user);
      }
    }
  }

  addUser(user: User) {
    this.userService.addUser(user).subscribe({
      next: (response) => {
        console.log('User added successfully:', response);
        this.router.navigate(['/users', response.id]);
      },
      error: (error) => {
        console.error('Error adding user:', error);
      },
    });
  }

  updateUser(user: User) {
    this.userService.updateUser(user).subscribe({
      next: (response) => {
        console.log('User updated successfully: ', response);
      },
      error: (error) => {
        console.error('Error updating user:', error);
      },
    });
  }

  get addresses() {
    return this.editForm.get('addresses') as FormArray;
  }

  private createAddress(): FormGroup {
    return this.formBuilder.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', Validators.required]
    });
  }

  addAddress() {
    this.addresses.push(this.createAddress());
  }

  removeAddress(index: number) {
    this.addresses.removeAt(index);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
