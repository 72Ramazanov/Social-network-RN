import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CommentCreateDto,
  Post,
  PostComment,
  PostCreateDto,
} from '../interfaces/post.interface';

export const postAction = createActionGroup({
  source: 'post',
  events: {
    'post loaded': props<{ posts: Post[] }>(),
    'fetch posts': emptyProps(),
    'create post': props<{ payload: PostCreateDto }>(),
    'delete post': props<{ postId: number }>(),
    

    'comments loaded': props<{ comments: PostComment[] }>(),
    'fetch comment': props<{ postId: number }>(),
    'create comment': props<{ payload: CommentCreateDto }>(),
  },
});
