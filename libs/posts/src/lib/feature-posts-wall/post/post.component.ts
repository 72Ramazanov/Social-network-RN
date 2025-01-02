import { SvgIconComponent, PastDatePipe, AvatarCircleComponent  } from '@tt/common-ui';
import { Component, computed, inject, input, OnInit, Signal } from '@angular/core';
import { CommentComponent, PostInputComponent } from '../../ui';
import { Post, postAction, PostComment, PostService, selectComment } from '../../data';
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
})
export class PostComponent implements OnInit {
  post = input<Post>();
  profile = inject(GlobalStoreService).me
  store = inject(Store)
  postService = inject(PostService);

  comments!: Signal<PostComment[]>;

  comments2 = computed(() => {
    if(this.comments()?.length > 0 ) {
      return this.comments()
    }

    return this.post()?.comments
  })
  
  
  
  
  
   ngOnInit() {    
    this.comments = this.store.selectSignal(selectComment(this.post()!.id))
   
    // this.comments.set(this.post()!.comments);
  }

   onCreated(commentText: string) {
    this.store.dispatch(postAction.fetchPosts({}))
    this.store.dispatch(postAction.fetchComment({postId: this.post()!.id}));

    if(commentText) return

    this.store.dispatch(postAction.createComment({
      payload: {
        text: commentText,
        authorId: this.profile()!.id,
        postId: this.post()!.id
      }
    }))

    // firstValueFrom(
    //   this.postService.getCommentsByPostId(this.post()!.id)
    // );
    // this.comments.set(comments);
  }
}
