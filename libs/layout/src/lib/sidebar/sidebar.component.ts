import { AsyncPipe, NgForOf } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import {
  ChatsService,
  ChatWSMessage,
  isErrorMessage,
  isUnreadMessage,
} from '@tt/data-access/chat';
import { ProfileService } from '@tt/profile';
import { firstValueFrom, Subscription } from 'rxjs';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@tt/data-access/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SvgIconComponent,
    NgForOf,
    SubscriberCardComponent,
    AsyncPipe,
    RouterLink,
    ImgUrlPipe,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  profileService = inject(ProfileService);
  chatService = inject(ChatsService);
  destroyRef = inject(DestroyRef);
  wsSubscribe!: Subscription;
  me = this.profileService.me;
  subcribers$ = this.profileService.getSubscribersShortList();
  countUnreadMessage: number = 0;
  authService = inject(AuthService)

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me',
      count: '',
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats',
      count: this.chatService.countUnreadMessage(),
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search',
      count: '',
    },
  ];

  handleChatMessage = (message: ChatWSMessage) => {
    if (isUnreadMessage(message)) {
      this.countUnreadMessage = message.data.count;
    }
  };

  async reconnect() {
    await firstValueFrom(this.authService.refreshAuthToken())
     
    this.connectWs()
  }

  connectWs () {
    this.wsSubscribe.unsubscribe()
    this.wsSubscribe = this.chatService
    .connectWs()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((message: ChatWSMessage) => {
      this.handleChatMessage(message);
      if (isErrorMessage(message)) {
        this.reconnect();
      }
    });
  }

  ngOnInit() {
    firstValueFrom(this.profileService.getMe());

    this.connectWs()
  }
}
