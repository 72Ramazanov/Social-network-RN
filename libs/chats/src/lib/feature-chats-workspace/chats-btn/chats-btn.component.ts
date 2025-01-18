import {SlicePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, input, OnInit} from '@angular/core';
import {AvatarCircleComponent, SvgIconComponent} from '@tt/common-ui';
import {LastMessageRes} from '@tt/data-access/chat';

@Component({
  selector: 'button [chats]',
  standalone: true,
  imports: [AvatarCircleComponent, SlicePipe, SvgIconComponent],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsBtnComponent implements OnInit{
  chat = input<LastMessageRes>();
  countUnreadMessage: number | undefined = 0;


  ngOnInit() {
   this.countUnreadMessage = this.chat()?.unreadMessages
  }
}
