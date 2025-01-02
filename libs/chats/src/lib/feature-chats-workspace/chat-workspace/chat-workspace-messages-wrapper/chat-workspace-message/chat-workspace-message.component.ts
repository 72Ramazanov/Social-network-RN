import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Message } from '@tt/data-access/chat';
import { AvatarCircleComponent } from '@tt/common-ui';

@Component({
  selector: 'app-chat-workspace-message',
  standalone: true,
  imports: [AvatarCircleComponent, DatePipe],
  templateUrl: './chat-workspace-message.component.html',
  styleUrl: './chat-workspace-message.component.scss',
})
export class ChatWorkspaceMessageComponent {
  message = input.required<Message[]>();
}
