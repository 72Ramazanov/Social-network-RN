import {
  SvgIconComponent,
  PastDatePipe,
  AvatarCircleComponent,
} from '@tt/common-ui';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  Signal,
} from '@angular/core';
import { CommentComponent, PostInputComponent } from '../../ui';
import {
  Post,
  postAction,
  PostComment,
  PostService,
  selectComment,
} from '../../data';
import { Store } from '@ngrx/store';
import { GlobalStoreService } from '@tt/data-access/shared/data';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    PastDatePipe,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent implements OnInit {
  post = input<Post>();
  profile = inject(GlobalStoreService).me;
  store = inject(Store);
  postService = inject(PostService);


  comments!: Signal<PostComment[]>;

  comments2 = computed(() => {
    const comments = this.comments();
    if (comments?.length > 0) {
      return [...comments].sort((a, b) => a.id - b.id);
    }
    return this.post()?.comments
      ? [...this.post()!.comments].sort((a, b) => a.id - b.id)
      : []; 
  });

  async ngOnInit() {
    this.comments = this.store.selectSignal(selectComment(this.post()!.id));
    // this.comments.set(this.post()!.comments);
    
  }

  async onCreated(commentText: string) {
    this.store.dispatch(postAction.fetchPosts());
    this.store.dispatch(postAction.fetchComment({ postId: this.post()!.id }));

    if (!commentText) return;

    this.store.dispatch(
      postAction.createComment({
        payload: {
          text: commentText,
          authorId: this.profile()!.id,
          postId: this.post()!.id,
        },
      })
    );

  }

  onDeletePost(postId: number) {
    this.store.dispatch(postAction.deletePost({ postId }));
  }




}
