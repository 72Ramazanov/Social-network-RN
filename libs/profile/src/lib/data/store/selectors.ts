import { createSelector } from "@ngrx/store";
import { ProfileFeature } from './reduce';

export const selectFilteredProfiles = createSelector(
    ProfileFeature.selectProfiles,
    (profile) => profile
)


export const selectProfilePageble = createSelector(
    ProfileFeature.selectProfileFeatureState,
    (state) => {
        return {
            page: state.page,
            size: state.size
        }
    }
)

export const selecProfileFilters= createSelector(
    ProfileFeature.selectProfileFilters,
    (filters) => filters
)