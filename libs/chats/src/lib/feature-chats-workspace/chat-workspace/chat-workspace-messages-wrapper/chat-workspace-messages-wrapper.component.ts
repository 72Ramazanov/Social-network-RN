import {debounceTime, firstValueFrom, fromEvent, Subject, takeUntil, timer,} from 'rxjs';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {ChatWorkspaceMessageComponent} from './chat-workspace-message/chat-workspace-message.component';
import {MessageInputComponent} from '../../../ui';
import {Chat, ChatsService} from '@tt/data-access/chat';
import {Router} from '@angular/router';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  standalone: true,
  imports: [ChatWorkspaceMessageComponent, MessageInputComponent],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWorkspaceMessagesWrapperComponent implements OnDestroy, AfterViewInit {
  chatsService = inject(ChatsService);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  // Субъект для управления жизненным циклом подписки на поток сообщений
  private destroy$ = new Subject<void>();
  // Обязательное свойство chat, которое возвращает объект типа Chat
  chat = input.required<Chat>();

// Свойство, которое хранит список сообщений активного чата, получаемых через сервис
  messages = this.chatsService.activeChatMessages;

  constructor(private router: Router) {
    this.startMessagePolling();
  }

  startMessagePolling() {
    timer(0, 10000) // Таймер, который срабатывает сразу (0 мс) и повторяется каждые 10 секунд
      .pipe(takeUntil(this.destroy$)) // Ожидает, пока не будет вызван destroy$
      .subscribe(async () => {
        await firstValueFrom(this.chatsService.getChatsById(this.chat().id)); // Ожидает получение данных о чате
      });
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async onSendMessage(messageText: string) {
    // Отправка сообщения через WebSocket
    this.chatsService.wsAdapter.sendMessage(messageText, this.chat().id);

    // Ожидание получения обновлённого чата
    await firstValueFrom(this.chatsService.getChatsById(this.chat().id));
  }

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
