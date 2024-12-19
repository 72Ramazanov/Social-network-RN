import { Component, input } from '@angular/core';
import { SlicePipe } from '@angular/common';

import { AvatarCircleComponent } from '@tt/common-ui';
import { LastMessageRes } from '../../data';

@Component({
  selector: 'button [chats]',
  standalone: true,
  imports: [AvatarCircleComponent, SlicePipe],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent {
  chat = input<LastMessageRes>();
  chatMessage = this.chat()?.message;
}
