import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { debounceTime, switchMap, tap } from 'rxjs';
import { DadataService } from '../../data';

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
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  onChange(value: any) {}

  onTouched() {}

  onSuggestionPick(city: string) {
    this.isDropdownOpened.set(false);
    this.innerSearchControl.patchValue(city, {
      emitEvent: false,
    });
    this.onChange(city);
  }
}
