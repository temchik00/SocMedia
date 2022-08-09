import { IOption } from "./option";

export interface IUserResponse {
    email: string;
    first_name: string;
    last_name: string;
    id: number;
    sex: number;
    city: number;
    birth_date: string;
    phone: string;
    avatar: string;
}

export interface IUserInfo {
    id: number;
    email: string;
    name: string;
    familyName: string;
    gender: IOption | null;
    city: IOption | null;
    birthDate: string | null;
    phone: string | null;
    avatar: string;
}
