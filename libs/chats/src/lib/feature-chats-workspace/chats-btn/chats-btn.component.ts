import { Component, input, OnInit } from '@angular/core';
import { SlicePipe } from '@angular/common';

import { AvatarCircleComponent } from '@tt/common-ui';
import { LastMessageRes } from '../../data';
import { SvgIconComponent } from "../../../../../common-ui/src/lib/components/svg-icon/svg-icon.component";

@Component({
  selector: 'button [chats]',
  standalone: true,
  imports: [AvatarCircleComponent, SlicePipe, SvgIconComponent],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent implements OnInit {
  chat = input<LastMessageRes>();
  chatMessage = this.chat()?.message;

  ngOnInit() {
    console.log(this.chat())
  }

}
