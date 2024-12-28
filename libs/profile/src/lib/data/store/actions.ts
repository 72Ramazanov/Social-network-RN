import { createActionGroup, props } from '@ngrx/store';
import { Profile } from '@tt/interfaces/profile';

export const profileAction = createActionGroup({
  source: 'profile',
  events: {
    'filters events': props<{ filters: Record<string, any> }>(),
    'profiles loaded': props<{ profiles: Profile[] }>(),
    'update filters': props<{ filters: Record<string, any> }>(),

  },
});
