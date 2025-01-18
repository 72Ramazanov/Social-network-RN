import { profileAction } from './../../data/store/actions';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { InfiniteScrollTriggerComponent } from '@tt/common-ui';
import {  selectFilteredProfiles } from './../../data';
import { ProfileCardComponent } from './../../ui';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ProfileCardComponent, ProfileFiltersComponent, InfiniteScrollTriggerComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent {
  store = inject(Store)

  profiles = this.store.selectSignal(selectFilteredProfiles);

  timeToFetch() {
    this.store.dispatch(profileAction.setPage({}))
  }



}
