import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, filter, map } from 'rxjs';
import { PostService } from '../services/post.service';
import { postAction } from './actions';

@Injectable({
  providedIn: 'root',
})
export class PostEffects {
  postService = inject(PostService);
  actions$ = inject(Actions);

  loadPosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postAction.fetchPosts),
      switchMap(() =>
        this.postService
          .fetchPosts()
          .pipe(map((posts) => postAction.postLoaded({ posts })))
      )
    );
  });

  createPosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postAction.createPost),
      switchMap(({payload}) =>
        this.postService
          .createPost({
            title: payload.title,
            content: payload.content,
            authorId: payload.authorId
          })
          .pipe(map((posts) => postAction.fetchPosts({})))
      )
    );
  });

  loadComments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postAction.fetchComment),
      switchMap(({postId}) =>
        this.postService.getCommentsByPostId(postId)
          .pipe(map((comments) => postAction.commentsLoaded({ comments })))
      )
    );
  });

createCommets$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postAction.createComment),
      switchMap(({payload}) =>
        this.postService
          .createComment({
            text: payload.text,
            authorId: payload.authorId,
            postId: payload.postId
          })
          .pipe(map(() => postAction.fetchPosts({})))
      )
    );
  });




}


