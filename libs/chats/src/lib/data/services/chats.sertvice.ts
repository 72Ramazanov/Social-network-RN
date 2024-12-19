import {
  Message,
  Chat,
  LastMessageRes,
} from '../interfaces/chats.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs';

import { ProfileService } from '@tt/profile';

@Injectable({
  providedIn: 'root',
})

export class ChatsService {
  http = inject(HttpClient);
  me = inject(ProfileService).me;

  activeChatMessages = signal<{ date: string; messages: Message[] }[]>([]); // Массив объектов с ключом date и массивом сообщений

  baseApiUrl: string = 'https://icherniakov.ru/yt-course/';
  chatsUrl: string = `${this.baseApiUrl}chat/`;
  messageUrl: string = `${this.baseApiUrl}message/`;

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
