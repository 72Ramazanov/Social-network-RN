import { AfterViewInit, Component, HostBinding, Input, input, OnInit } from '@angular/core';
import { Message } from '../../../../../data/interfaces/chats.interface';
import { AvatarCircleComponent } from "../../../../../common-ui/avatar-circle/avatar-circle.component";
import { AsyncPipe, DatePipe, JsonPipe, NgFor } from '@angular/common';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';

@Component({
  selector: 'app-chat-workspace-message',
  standalone: true,
  imports: [AvatarCircleComponent, DatePipe],
  templateUrl: './chat-workspace-message.component.html',
  styleUrl: './chat-workspace-message.component.scss'
})
export class ChatWorkspaceMessageComponent {
  message = input.required<Message[]>()


  
}
