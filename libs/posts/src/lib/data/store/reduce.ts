import { createFeature, createReducer, on } from '@ngrx/store';
import { Profile } from '@tt/interfaces/profile';
import { postAction } from './actions';
import { Post, PostComment } from '../interfaces/post.interface';

export interface PostState {
  posts: Post[];
  comments: Record<number, PostComment[]>;
}

export const initialState: PostState = {
  posts: [],
  comments: {},
};

export const PostFeature = createFeature({
  name: 'postFeature',
  reducer: createReducer(
    initialState,

    on(postAction.postLoaded, (state, { posts }) => ({
      ...state,
      posts,
    })),

    on(postAction.commentsLoaded, (state, { comments }) => {
      const stateComments = {...state.comments}


      if(comments.length) {
        stateComments[comments[0].postId] = comments

      }

      return {
        ...state,
        comments: stateComments
      };
    })
  ),
});
