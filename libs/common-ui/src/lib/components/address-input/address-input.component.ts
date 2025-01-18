import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { debounceTime, switchMap, tap } from 'rxjs';
import { DadataService } from '../../data';
import { DadataSuggestion } from '../../data/interfaces/dadata.interface';

@Component({
  selector: 'tt-address-input',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './address-input.component.html',
  styleUrl: './address-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddressInputComponent),
    },
  ],
})
export class AddressInputComponent implements ControlValueAccessor {
  innerSearchControl = new FormControl();
  #dadataService = inject(DadataService);
  isDropdownOpened = signal<boolean>(false);
  cdr = inject(ChangeDetectorRef);

  isAddressVisible = signal<boolean>(false);

  addressForm = new FormGroup({
    city: new FormControl(''),
    street: new FormControl(''),
    building: new FormControl(''),
    apartment: new FormControl(''),
  });

  suggestions$ = this.innerSearchControl.valueChanges.pipe(
    debounceTime(500),
    switchMap((val) => {
      return this.#dadataService.getSuggestion(val).pipe(
        tap((res) => {
          this.isDropdownOpened.set(!!res.length);
        })
      );
    })
  );

  writeValue(city: string | null): void {
    this.innerSearchControl.patchValue(city, {
      emitEvent: false,
    });
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange(value: any) {}

  onTouched() {}

  onSuggestionPick(suggest: DadataSuggestion) {
    this.isDropdownOpened.set(false);
    // this.innerSearchControl.patchValue(suggest.value, {
    //   emitEvent: false,
    // });

    this.isAddressVisible.set(true)

    this.addressForm.patchValue({
      city: suggest.data.city || '',
      street: suggest.data.street || '',
      building: suggest.data.house || '',
      apartment: suggest.data.flat || '',
    });

    const formValues = this.addressForm.getRawValue();
    const addressString =
      `${formValues.city} ${formValues.street} ${formValues.building} ${formValues.apartment}`.trim();

    this.updateInnerSearchControl();

    // this.onChange(addressString);
    this.cdr.markForCheck();
  }

  updateInnerSearchControl() {
    const formValues = this.addressForm.value;
    const addressString = `${formValues.city || ''} ${
      formValues.street || ''
    } ${'дом' + formValues.building || ''} ${
      formValues.apartment? 'кв.' + formValues.apartment  : ''
    }`.trim();
    this.innerSearchControl.patchValue(addressString, {
      emitEvent: false,
    });
    this.onChange(addressString);
  }

  onSave() {
    this.updateInnerSearchControl();
    console.log('Saved address:', this.innerSearchControl.value);
  }
}
