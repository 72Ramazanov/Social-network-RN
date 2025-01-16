import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  Renderer2,
  Signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { GlobalStoreService } from '@tt/data-access/shared/data';
import { debounceTime, firstValueFrom, fromEvent } from 'rxjs';
import { Post, PostService } from '../../data';
import { postAction, selectPost } from '../../data/store';
import { PostInputComponent } from '../../ui/post-input/post-input.component';
import { PostComponent } from '../post/post.component';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostInputComponent, PostComponent,],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFeedComponent implements AfterViewInit, OnInit {
  postService = inject(PostService);
  hostElement = inject(ElementRef);
  profile = inject(GlobalStoreService).me;
  r2 = inject(Renderer2);
  store = inject(Store);
  destroyRef = inject(DestroyRef);
  
  feed = this.store.selectSignal(selectPost);

 ngOnInit() {
    console.log(this.feed())
    this.store.select(selectPost).subscribe(a => {
      console.log(a)
    })
    this.store.dispatch(postAction.fetchPosts());
    // this.store.dispatch(postAction.postLoaded({posts: []}));
    // firstValueFrom(this.postService.fetchPosts());
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

  @HostListener('window:resize')
  onWindowResize() {
    this.resizeFeed();
  }

  ngAfterViewInit() {
    this.resizeFeed();
    fromEvent(window, 'resize')
      .pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.resizeFeed();
      });
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 10 - 10;

    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }
}
