import { createSelector } from '@ngrx/store';
import { PostFeature } from './reduce';

export const selectPost = createSelector(
  PostFeature.selectPosts,
  (posts) => posts
);

export const selectComment = (postId: number) => createSelector(
  PostFeature.selectComments,
  (comments) => comments[postId]
);
