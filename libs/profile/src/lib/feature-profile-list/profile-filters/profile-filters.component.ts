import {Store} from '@ngrx/store';
import {ChangeDetectionStrategy, Component, EventEmitter, inject, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, startWith, Subscription,} from 'rxjs';
import {profileAction, ProfileService, selectProfileFilters} from '../../data';

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFiltersComponent implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  store = inject(Store);

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });

  searchFormSub!: Subscription;
  filtersSub!: Subscription;

  constructor() {}

  ngOnInit() {
    // Подписка на фильтры из хранилища
    this.filtersSub = this.store.select(selectProfileFilters).subscribe(filters => {
      // Обновляем форму фильтрами из состояния
      this.searchForm.patchValue(filters, { emitEvent: false });

      // Инициируем запрос пользователей с актуальными фильтрами
      this.store.dispatch(profileAction.filtersEvents({ filters }));
    });

    // Подписка на изменения формы поиска
    this.searchFormSub = this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(300),
      )
      .subscribe(formValue => {
        // Когда форма изменяется, обновляем фильтры и запускаем запрос
        this.store.dispatch(profileAction.filtersEvents({ filters: formValue }));
      });
  }

  ngOnDestroy() {
    // Отписка от всех подписок
    this.searchFormSub.unsubscribe();
    this.filtersSub.unsubscribe();
  }

  @Output() filtersChanged = new EventEmitter<Record<string, any>>();

  onFiltersUpdate(filters: Record<string, any>) {
    this.filtersChanged.emit(filters);
  }
}
