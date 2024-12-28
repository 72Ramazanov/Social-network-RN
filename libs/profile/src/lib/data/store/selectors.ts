import { ProfileFeature } from './reduce';
import { createSelector } from "@ngrx/store";

export const selectFilteredProfiles = createSelector(
    ProfileFeature.selectProfiles,
    (profile) => profile
)