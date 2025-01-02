import { ProfileService } from '../../../../../data-access/src/lib/profile/services/profile.service';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, filter, map } from 'rxjs';
import { profileAction } from './actions';

@Injectable({
  providedIn: 'root',
})
export class ProfileEffects {
  profileService = inject(ProfileService);
  actions$ = inject(Actions);

  filtesProfile = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileAction.filtersEvents),
      switchMap(({ filters }) => {
        return this.profileService.filterProfiles(filters);
      }),
      map((res) => profileAction.profilesLoaded({ profiles: res.items }))
    );
  });
}
