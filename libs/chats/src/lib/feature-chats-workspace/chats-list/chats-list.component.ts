import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ChatsService } from '@tt/data-access/chat';
import { map, startWith, switchMap } from 'rxjs';
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component';

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [
    ChatsBtnComponent,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatsListComponent {
  // Инжектируем сервис ChatsService, который предоставляет данные о чатах
  chatsService = inject(ChatsService);

  // Создаем FormControl для фильтрации чатов (изначальное значение — пустая строка)
  filterChatsControl = new FormControl('');

  // chats$ — это поток, содержащий список чатов. (Ранее использовалась простая версия, закомментирована ниже)
  // chats$ = this.chatsService.getMyChats()

  // Используем более сложный поток для фильтрации чатов
  chats$ = this.chatsService.getMyChats().pipe(
    // При получении списка чатов (`chats`) переходим к другому потоку — изменению значения в `filterChatsControl`
    switchMap((chats) => {
      return this.filterChatsControl.valueChanges.pipe(
        // Начинаем поток со значения по умолчанию (пустая строка)
        startWith(''),
        // Для каждого значения в `filterChatsControl` фильтруем список чатов
        map((inputValue) => {
          return chats.filter((chat) => {
            // Для фильтрации преобразуем имя и фамилию пользователя из чата в нижний регистр
            // и проверяем, содержит ли оно введенное значение (также в нижнем регистре)
            return `${chat.userFrom.lastName} ${chat.userFrom.firstName}`
              .toLowerCase()
              .includes(inputValue?.toLowerCase() ?? '');
          });
        })
      );
    })
  );
}

