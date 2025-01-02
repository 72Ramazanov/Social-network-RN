import { createFeature, createReducer, on } from '@ngrx/store';
import { Profile } from '@tt/data-access/profile';
import { profileAction } from './actions';

export interface ProfileState {
  profiles: Profile[];
  profileFilters: Record<string, any>;
}

export const initialState: ProfileState = {
  profiles: [],
  profileFilters: {},
};

export const ProfileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(
    initialState,
    on(profileAction.profilesLoaded, (state, payload) => {
      return {
        ...state,
        profiles: payload.profiles,
      };
    }),

    on(profileAction.updateFilters, (state, { filters }) => ({
      ...state,
      profileFilters: filters,
    }))
  ),
});
