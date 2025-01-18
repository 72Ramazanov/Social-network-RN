import { ChatsService } from '@tt/data-access/chat';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChatWorkspaceHeaderComponent } from './chat-workspace-header/chat-workspace-header.component';
import { ChatWorkspaceMessagesWrapperComponent } from './chat-workspace-messages-wrapper/chat-workspace-messages-wrapper.component';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, of, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-chat-workspace',
  standalone: true,
  imports: [
    ChatWorkspaceHeaderComponent,
    ChatWorkspaceMessagesWrapperComponent,
    AsyncPipe,
  ],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceComponent {
  route = inject(ActivatedRoute);
  router = inject(Router)
  chatsService = inject(ChatsService);


  // Поток, который отслеживает активный чат. Он реагирует на изменения параметров маршрута.
  activeChat$ = this.route.params.pipe(
    // Используем switchMap для обработки параметра маршрута `id`.
    switchMap(({ id }) => {
      // Если параметр `id` равен 'new', обрабатываем создание нового чата.
      if (id === 'new') {
        // Отслеживаем query-параметры маршрута и фильтруем их, проверяя наличие `userId`.
        return this.route.queryParams.pipe(
          filter(({ userId }) => userId), // Пропускаем только те query-параметры, где `userId` существует.
          // Если `userId` есть, создаем новый чат.
          switchMap(({ userId }) => {
            return this.chatsService.createChat(userId).pipe(
              // После успешного создания чата перенаправляем пользователя на URL с id нового чата.
              switchMap(chat => {
                this.router.navigate(['chats', chat.id]); // Навигация на созданный чат.
                return of(null); // Возвращаем поток с `null`, так как новый чат уже обработан.
              })
            );
          })
        );
      }
      // Если `id` не равен 'new', загружаем данные чата по указанному `id`.
      return this.chatsService.getChatsById(id);
    })
  );
}
