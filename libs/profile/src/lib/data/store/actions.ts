import { createActionGroup, props } from '@ngrx/store';
import { Profile } from '@tt/data-access/profile';

export const profileAction = createActionGroup({
  source: 'profile',
  events: {
    'filters events': props<{ filters: Record<string, any> }>(),
    'profiles loaded': props<{ profiles: Profile[] }>(),
    'set page': props<{ page?: number }>(),

    'update filters': props<{ filters: Record<string, any> }>(),
  },
});
