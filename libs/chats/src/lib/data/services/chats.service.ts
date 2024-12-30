import { AuthService } from './../../../../../auth/src/lib/auth/auth.service';
import { Message, Chat, LastMessageRes } from '../interfaces/chats.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ProfileService } from '@tt/profile';
import { ChatWSService } from '../interfaces/chat-ws-service.interface';
import { ChatWSNativeService } from './chat-ws-native-service';
import { ChatWSMessage } from '../interfaces/chat-ws-message.interface';
import { isNewMessage, isUnreadMessage } from '../interfaces/type-guards';
import { ChatWsRxjsService } from './chat-ws-rxjs.service';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  http = inject(HttpClient);
  me = inject(ProfileService).me;
  #authService = inject(AuthService);

  baseApiUrl: string = 'https://icherniakov.ru/yt-course/';
  chatsUrl: string = `${this.baseApiUrl}chat/`;
  messageUrl: string = `${this.baseApiUrl}message/`;

  activeChatMessages = signal<{ date: string; messages: Message[] }[]>([]); // Массив объектов с ключом date и массивом сообщений

  wsAdapter: ChatWSService = new ChatWsRxjsService();

  connectWs() {
    return this.wsAdapter.connect({
      url: `${this.baseApiUrl}chat/ws`,
      token: this.#authService.token ?? '',
      handleMessage: this.handleMessage,
      // handleMessage: this.handleMessage.bind(this)
    }) as Observable<ChatWSMessage>
  }

  handleMessage = (message: ChatWSMessage) => {
    if(!('action' in message)) return

    if(isUnreadMessage(message)) {
      message.data.count
    }
  
    if (isNewMessage(message)) {
      // Получаем текущие сообщения
      const currentMessages = this.activeChatMessages();
  
      // Определяем текущую дату
      const currentDate = new Date().toISOString().split('T')[0]; // Формат: YYYY-MM-DD
  
      // Ищем объект с текущей датой
      const dateEntry = currentMessages.find(entry => entry.date === currentDate);
  
      const newMessage: Message = {
        id: message.data.id,
        userFromId: message.data.author,
        personalChatId: message.data.chat_id,
        text: message.data.message,
        createdAt: message.data.created_at,
        isRead: false,
        isMine: false,
      };
  
      if (dateEntry) {
        // Добавляем новое сообщение в массив сообщений текущей даты
        dateEntry.messages = [...dateEntry.messages, newMessage];
      } else {
        // Создаем новый объект для текущей даты
        currentMessages.push({
          date: currentDate,
          messages: [newMessage],
        });
      }
  
      // Устанавливаем обновленный массив
      this.activeChatMessages.set(currentMessages);
    }

    console.log(message)
  };
  

  // constructor() {
  //   console.log(this.activeChatMessages())
  // }

  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {});
  }

  getMyChats() {
    return this.http.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`);
  }

  getChatsById(chatId: number) {
    return this.http.get<Chat>(`${this.chatsUrl}${chatId}`).pipe(
      map((chat) => {
        // Массив для хранения сгруппированных сообщений по дате
        const groupedMessages: { date: string; messages: Message[] }[] = [];

        // Проходим по сообщениям чата
        chat.messages.forEach((message: Message) => {
          const formattedDate = this.formatRelativeTime(message.createdAt);

          // Находим группу сообщений с этой датой
          let dateGroup = groupedMessages.find(
            (group) => group.date === formattedDate
          );

          if (!dateGroup) {
            // Если группы для этой даты ещё нет, создаём новую
            dateGroup = { date: formattedDate, messages: [] };
            groupedMessages.push(dateGroup);
          }

          // Добавляем сообщение с информацией о пользователе
          dateGroup.messages.push({
            ...message,
            user:
              chat.userFirst.id === message.userFromId
                ? chat.userFirst
                : chat.userSecond,
            isMine: message.userFromId === this.me()!.id,
          });
        });

        // Обновляем activeChatMessages с результатом
        this.activeChatMessages.set(groupedMessages);

        // Возвращаем обновленный чат
        return {
          ...chat,
          companion:
            chat.userFirst.id === this.me()!.id
              ? chat.userSecond
              : chat.userFirst,
          messages: chat.messages,
        };
      })
    );
  }

  sendMessage(chatId: number, message: string) {
    return this.http.post<Message>(
      `${this.messageUrl}send/${chatId}`,
      {},
      {
        params: {
          message,
        },
      }
    );
  }

  formatRelativeTime(inputDate: string): string {
    const now = new Date();
    const date = new Date(inputDate);

    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Сегодня';
    } else if (diffInDays === 1) {
      return 'Вчера';
    } else if (diffInDays < 7) {
      return `${diffInDays} ${this.declineWord(diffInDays, [
        'день',
        'дня',
        'дней',
      ])} назад`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} ${this.declineWord(weeks, [
        'неделя',
        'недели',
        'недель',
      ])} назад`;
    } else {
      const months = Math.floor(diffInDays / 30);
      return `${months} ${this.declineWord(months, [
        'месяц',
        'месяца',
        'месяцев',
      ])} назад`;
    }
  }

  declineWord(number: number, forms: [string, string, string]): string {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return forms[2];
    }
    if (lastDigit === 1) {
      return forms[0];
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return forms[1];
    }
    return forms[2];
  }
}
