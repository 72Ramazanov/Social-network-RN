import { createActionGroup, props } from '@ngrx/store';
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
    'fetch posts': props<{ page?: number }>(),
    'create post': props<{ payload: PostCreateDto }>(),

    'comments loaded': props<{ comments: PostComment[] }>(),
    'fetch comment': props<{ postId: number }>(),
    'create comment': props<{ payload: CommentCreateDto }>(),
  },
});
