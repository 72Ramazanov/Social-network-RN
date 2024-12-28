import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  Renderer2,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PostInputComponent } from '../../ui/post-input/post-input.component';
import { PostComponent } from '../post/post.component';
import { PostService } from '../../data';
import { Store } from '@ngrx/store';
import { postAction, selectPost } from '../../data/store';
import { GlobalStoreService } from '@tt/shared';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent implements AfterViewInit, OnInit {
  postService = inject(PostService);
  hostElement = inject(ElementRef);
  profile = inject(GlobalStoreService).me;
  r2 = inject(Renderer2);
  store = inject(Store);

  // feed = this.postService.posts;
  feed = this.store.selectSignal(selectPost);

  @HostListener('window:resize')
  onWindowResize() {
    this.resizeFeed();
  }

  constructor() {
    firstValueFrom(this.postService.fetchPosts());
  }

  ngOnInit() {
    this.store.dispatch(postAction.fetchPosts({}));
  }

  onCreatedPost(postText: string) {
    if (!postText) return;

    this.store.dispatch(
      postAction.createPost({
        payload: {
          title: 'Клевый пост',
          content: postText,
          authorId: this.profile()!.id,
        },
      })
    );
  }

  onCreatedComment() {
    
  }

  ngAfterViewInit() {
    this.resizeFeed();
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 10 - 10;

    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }
}
