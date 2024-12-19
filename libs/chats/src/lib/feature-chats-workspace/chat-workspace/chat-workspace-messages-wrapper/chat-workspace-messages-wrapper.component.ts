import {
  debounceTime,
  firstValueFrom,
  fromEvent,
  Subject,
  takeUntil,
  timer,
} from 'rxjs';
import {
  Component,
  inject,
  input,
  ElementRef,
  Renderer2,
  HostListener,
  OnDestroy,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component';
import { MessageInputComponent } from '../../../ui';
import { Chat, ChatsService } from '../../../data';
import {  ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  standalone: true,
  imports: [ChatWorkspaceMessageComponent, MessageInputComponent],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
})
export class ChatWorkspaceMessagesWrapperComponent
  implements OnDestroy, AfterViewInit
{
  scroller = inject(ViewportScroller);
  chatsService = inject(ChatsService);
  chat = input.required<Chat>();

  messages = this.chatsService.activeChatMessages;

  groupedMessages: any = [];

  constructor(private router: Router) {
    this.startMessagePolling();
  }
  private destroy$ = new Subject<void>();

  startMessagePolling() {
    timer(0, 10000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async () => {
        await firstValueFrom(this.chatsService.getChatsById(this.chat().id));
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async onSendMessage(messageText: string) {
    await firstValueFrom(
      this.chatsService.sendMessage(this.chat().id, messageText)
    );

    await firstValueFrom(this.chatsService.getChatsById(this.chat().id));
  }

  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  @HostListener('window:resize')
  onWindowResize() {
    this.resizeFeed();
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 10 - 10;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  @ViewChild('messageWrapper') messageWrapper!: ElementRef;

  ngAfterViewInit(): void {
    console.log(this.messageWrapper);
    this.scrollToBottom();
    fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.resizeFeed();
        this.scrollToBottom();
      });
  }

  scrollToBottom() {
    const wrapper = this.messageWrapper.nativeElement;
    wrapper.scrollTop = wrapper.scrollHeight;
  }
}
