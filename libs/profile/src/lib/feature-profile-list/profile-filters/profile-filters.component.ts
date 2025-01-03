import { Store } from '@ngrx/store';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnDestroy, Output } from '@angular/core';
import { FormBuilder,  ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';
import { profileAction, ProfileService } from '../../data';

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFiltersComponent implements OnDestroy {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);
  store = inject(Store)

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });

  searchFormSub!: Subscription;

  constructor() {
    this.searchFormSub = this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(300),
      )
      .subscribe(formValue =>{
        this.store.dispatch(profileAction.filtersEvents({filters: formValue}));
      });
  }

  ngOnDestroy() {
    this.searchFormSub.unsubscribe();
  }



  @Output() filtersChanged = new EventEmitter<Record<string, any>>();

  onFiltersUpdate(filters: Record<string, any>) {
    this.filtersChanged.emit(filters);
  }
}
