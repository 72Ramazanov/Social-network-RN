import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatsListComponent } from '../chats-list/chats-list.component';
import { ChatsService } from '@tt/data-access/chat';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [RouterOutlet, ChatsListComponent],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsPageComponent {
  // #chatService = inject(ChatsService);

  // constructor() {
  //   this.#chatService.connectWs().pipe(
  //     takeUntilDestroyed()
  //   ).subscribe()
  // }

  
}
