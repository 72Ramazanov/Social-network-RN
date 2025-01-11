import { createFeature, createReducer, on } from '@ngrx/store';
import { Profile } from '@tt/data-access/profile';
import { profileAction } from './actions';

export interface ProfileState {
  profiles: Profile[];
  profileFilters: Record<string, any>;
  page: number;
  size: number;
}

export const initialState: ProfileState = {
  profiles: [],
  profileFilters: {},
  page: 1,
  size: 10,
};

export const ProfileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(
    initialState,
    on(profileAction.profilesLoaded, (state, payload) => {
      return {
        ...state,
        profiles: state.profiles.concat(payload.profiles),
      };
    }),

    on(profileAction.updateFilters, (state, { filters }) => ({
      ...state,
      profileFilters: filters,
    })),

    on(profileAction.filtersEvents, (state, payload) => {
      return {
        ...state,
        profiles: [],
        profileFilters: payload.filters,
        page: 1,
      };
    }),

    on(profileAction.setPage, (state, payload) => {
      let page = payload.page;

      if (!page) page = state.page + 1;

      return {
        ...state,
        page,
      };
    })
  ),
});
