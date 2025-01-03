import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { AvatarCircleComponent, SvgIconComponent } from '@tt/common-ui';
import { ChatsService, ChatWSMessage, isUnreadMessage, LastMessageRes } from '@tt/data-access/chat';

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
  chatMessage = this.chat()?.message;
  chatService = inject(ChatsService);
  countUnreadMessage: number | undefined = 0;

  handleChatMessage = (message: ChatWSMessage) => {
    if (isUnreadMessage(message)) {
      this.countUnreadMessage = message.data.count;
    }
  };

  ngOnInit() {
   this.countUnreadMessage = this.chat()?.unreadMessages

  }
}
