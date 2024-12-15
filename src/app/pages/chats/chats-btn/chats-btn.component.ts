import { Component, input } from '@angular/core';
import { AvatarCircleComponent } from "../../../common-ui/avatar-circle/avatar-circle.component";
import { LastMessageRes } from '../../../data/interfaces/chats.interface';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'button [chats]',
  standalone: true,
  imports: [AvatarCircleComponent, SlicePipe],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss'
})
export class ChatsBtnComponent {
  chat = input<LastMessageRes>()
  chatMessage = this.chat()?.message
  
}
