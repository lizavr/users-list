import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Address, User, UsersService } from '../../users.service';
import { Subscription } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  EmailValidator,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { CustomPhoneInputComponent } from '../../custom-phone-input/custom-phone-input.component';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    CustomPhoneInputComponent,
  ],
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
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.editForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      surname: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      dateOfBirth: [''],
      nationality: [''],
      phone: [''],
      addresses: this.formBuilder.array([]),
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
    return {
      id: 0,
      name: '',
      surname: '',
      email: '',
      nationality: '',
      phone: '',
      dateOfBirth: '',
      addresses: [],
    };
  }

  initializeUser(user: User) {
    this.user = user;
    this.initializeForm(user);
  }

  initializeForm(user: User) {
    if (!this.editForm) {
      this.editForm = this.formBuilder.group({
        username: [user.name, [Validators.required, Validators.minLength(3)]],
        surname: [user.surname, [Validators.required, Validators.minLength(3)]],
        email: [user.email, [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        dateOfBirth: [user.dateOfBirth],
        nationality: [user.nationality],
        phone: [user.phone],
        addresses: this.formBuilder.array(
          user.addresses.map((address) => this.createAddressFormGroup(address))
        ),
      });
    } else {
      this.editForm.patchValue({
        username: user.name,
        surname: user.surname,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        nationality: user.nationality,
        phone: user.phone,
      });
      const addressFormArray = this.editForm.get('addresses') as FormArray;
      addressFormArray.clear();
      user.addresses.forEach((address) => {
        addressFormArray.push(this.createAddressFormGroup(address));
      });
    }
  }

  private createAddressFormGroup(address: Address): FormGroup {
    return this.formBuilder.group({
      country: [address.country, Validators.required],
      city: [address.city, Validators.required],
      street: [address.street, Validators.required],
      zip: [address.zip, Validators.required],
    });
  }

  onSubmit() {
    if (this.editForm.valid) {
      const formData = this.editForm.value;

      const user: User = {
        id: this.user?.id ?? 0,
        name: formData.username,
        surname: formData.surname,
        email: formData.email,
        nationality: formData.nationality,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        addresses: formData.addresses,
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

  deleteUser() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '40%',
      data: {
        title: 'Delete User',
        message: 'Are you sure you want to delete this user?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteUser(this.user?.id ?? 0).subscribe({
          next: (response) => {
            console.log('User deleted successfully: ', response);
            this.router.navigate(['/users']);
          },
          error: (error) => {
            console.error('Error deleting user:', error);
          },
        });
      }
    });
  }

  get addresses() {
    return this.editForm.get('addresses') as FormArray;
  }

  private createAddress(): FormGroup {
    return this.formBuilder.group({
      country: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', Validators.required],
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
