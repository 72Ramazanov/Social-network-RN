import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { ProfileService } from '@tt/data-access/profile';
import { profileAction } from './actions';
import { selecProfileFilters, selectProfilePageble } from './selectors';

@Injectable({
  providedIn: 'root',
})
export class ProfileEffects {
  profileService = inject(ProfileService);
  actions$ = inject(Actions);
  store = inject(Store);

  filtesProfile = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileAction.filtersEvents, profileAction.setPage),
      withLatestFrom(
        this.store.select(selecProfileFilters),
        this.store.select(selectProfilePageble)
      ),
      switchMap(([_, filters, pageable]) => {
        return this.profileService.filterProfiles({
          ...pageable,
          ...filters,
        });
      }),
      map((res) => profileAction.profilesLoaded({ profiles: res.items }))
    );
  });
}
