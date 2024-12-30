import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ChatConnectionWSParams, ChatWSService } from './../interfaces/chat-ws-service.interface';
import { ChatWSMessage } from '../interfaces/chat-ws-message.interface';
import { finalize, Observable, tap } from 'rxjs';


export class ChatWsRxjsService implements ChatWSService{

    #socket: WebSocketSubject<ChatWSMessage> | null = null

    connect(params: ChatConnectionWSParams): Observable<ChatWSMessage> {
        if (!this.#socket) {
            this.#socket = webSocket({
                url: params.url,
                protocol: [params.token]
            })
        }        

        return this.#socket.asObservable().pipe(
            tap(message => params.handleMessage(message)),
            finalize(() => console.log("Hello Word!"))
        )
    }

    disconnect(): void {
        this.#socket?.complete()
    }

    sendMessage(text: string, chatId: number): void {
        this.#socket?.next({
            text,
            chat_id: chatId,
        })
    }
}