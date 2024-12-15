import {DatePipe} from '@angular/common';
import {Component, inject, input, OnInit, signal} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {AvatarCircleComponent} from '../../../common-ui/avatar-circle/avatar-circle.component';
import {SvgIconComponent} from '../../../common-ui/svg-icon/svg-icon.component';
import {Post, PostComment} from '../../../data/interfaces/post.interface';
import {PostService} from '../../../data/services/post.service';
import {PostInputComponent} from '../post-input/post-input.component';
import {CommentComponent} from './comment/comment.component';
import { PastDatePipe } from '../../../helpers/pipes/past-date.pipe';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    PastDatePipe,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  post = input<Post>()

  comments = signal<PostComment[]>([])

  postService = inject(PostService)

  async ngOnInit() {
    this.comments.set(this.post()!.comments)
  }

  async onCreated() {
    const comments = await firstValueFrom(this.postService.getCommentsByPostId(this.post()!.id))
    this.comments.set(comments)
  }
}
