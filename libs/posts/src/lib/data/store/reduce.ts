import { createFeature, createReducer, on } from '@ngrx/store';
import { Post, PostComment } from '../interfaces/post.interface';
import { postAction } from './actions';

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
    

    on(postAction.postLoaded, (state, { posts }) => {
      return {
        ...state,
        posts
      };
    }),

    on(postAction.commentsLoaded, (state, { comments }) => {
      const stateComments = { ...state.comments };

      if (comments.length) {
        stateComments[comments[0].postId] = comments;
      }

      return {
        ...state,
        comments: stateComments,
      };
    }), 
    on(postAction.deletePost, (state, { postId }) => ({
      ...state,
      posts: state.posts.filter((post) => post.id !== postId),
    })),
  ),
});
