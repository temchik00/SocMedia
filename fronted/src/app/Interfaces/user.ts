import { City } from './city';
import { Sex } from './sex';

interface UserBase {
  id: number;
  first_name: string;
  second_name: string;
  birth_date: Date | undefined;
  phone: string | undefined;
}

export interface User extends UserBase {
  sex: Sex | undefined;
  city: City | undefined;
}

export interface UserResponse extends UserBase {
  sex: number | undefined;
  city: number | undefined;
}
