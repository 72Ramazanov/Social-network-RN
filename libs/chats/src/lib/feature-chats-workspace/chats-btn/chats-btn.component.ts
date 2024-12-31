import { SlicePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { AvatarCircleComponent, SvgIconComponent } from '@tt/common-ui';
import { LastMessageRes } from '@tt/data-access';

@Component({
  selector: 'button [chats]',
  standalone: true,
  imports: [AvatarCircleComponent, SlicePipe, SvgIconComponent],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent  {
  chat = input<LastMessageRes>();
  chatMessage = this.chat()?.message;

}
