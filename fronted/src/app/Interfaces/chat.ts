import { Message } from './message';

export interface ChatResponse {
  id: number;
  name: string;
  image: string;
}

export interface Chat extends ChatResponse {
  lastMessage: Message | undefined;
}
