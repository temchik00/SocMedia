import { UserResponse } from './user';

interface MessageBase {
  id: number;
  content: string;
  time_posted: Date;
}

export interface MessageResponse extends MessageBase {
  user_id: number;
}

export interface Message extends MessageBase {
  user: UserResponse;
}
