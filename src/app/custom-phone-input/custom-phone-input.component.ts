import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import intlTelInput from 'intl-tel-input';

@Component({
  selector: 'app-custom-phone-input',
  standalone: true,
  imports: [],
  templateUrl: './custom-phone-input.component.html',
  styleUrl: './custom-phone-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomPhoneInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomPhoneInputComponent),
      multi: true,
    },
  ],
})
export class CustomPhoneInputComponent
  implements AfterViewInit, ControlValueAccessor, Validator
{
  @ViewChild('phoneInput') phoneInput: ElementRef | undefined;
  private intlTelInputInstance: any;
  private onChange = (_: any) => {};
  private onTouched = () => {};

  ngAfterViewInit() {
    this.intlTelInputInstance = intlTelInput(
      this.phoneInput?.nativeElement,
      {}
    );
    this.phoneInput?.nativeElement.addEventListener('countrychange', () => {
      this.onChange(this.intlTelInputInstance.getNumber());
    });
  }

  writeValue(obj: any): void {
    if (!this.phoneInput) {
      return;
    }
    if (obj) {
      this.phoneInput.nativeElement.value = obj;
      this.intlTelInputInstance.setNumber(obj);
    } else {
      this.phoneInput.nativeElement.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  validate(c: AbstractControl): ValidationErrors | null {
    if (!this.intlTelInputInstance) {
      return null;
    }
    const isValid = this.intlTelInputInstance.isValidNumber();
    return isValid ? null : { phoneInvalid: true };
  }

  setDisabledState?(isDisabled: boolean): void {
    if (!this.phoneInput) {
      return;
    }
    this.phoneInput.nativeElement.disabled = isDisabled;
  }
}
