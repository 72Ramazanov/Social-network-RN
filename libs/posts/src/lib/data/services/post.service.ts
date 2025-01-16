import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, switchMap, tap } from 'rxjs';
import {
  CommentCreateDto,
  Post,
  PostComment,
  PostCreateDto,
} from '../interfaces/post.interface';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  #http = inject(HttpClient);

  posts = signal<Post[]>([]);

  baseApiUrl = 'https://icherniakov.ru/yt-course/';

  createPost(payload: PostCreateDto) {
    return this.#http.post<Post>(`${this.baseApiUrl}post/`, payload).pipe(
      switchMap(() => {
        return this.fetchPosts();
      })
    );
  }

  fetchPosts() {
    return this.#http
      .get<Post[]>(`${this.baseApiUrl}post/`)
      .pipe(tap((res) => this.posts.set(res)));
  }

  createComment(payload: CommentCreateDto) {
    return this.#http.post<PostComment>(`${this.baseApiUrl}comment/`, payload);
  }

  getCommentsByPostId(postId: number) {
    return this.#http
      .get<Post>(`${this.baseApiUrl}post/${postId}`)
      .pipe(map((res) => res.comments));
  }

  getPost(postId: number) {
    return this.#http.get<Post[]>(`${this.baseApiUrl}post${postId}`)
      .pipe(
        map(res => res)
      )
  }
  deletePost(postId: number): Observable<void> {
    return this.#http.delete<void>(`${this.baseApiUrl}post/${postId}`);
  }


}
