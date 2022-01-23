import { City } from './city';
import { Sex } from './sex';

interface UserBase {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: Date | null;
  phone: string | null;
  avatar: string;
}

export interface User extends UserBase {
  sex: Sex | null;
  city: City | null;
}

export interface UserResponse extends UserBase {
  sex: number | null;
  city: number | null;
}
