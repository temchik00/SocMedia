from typing import Optional
from pydantic import BaseModel
from datetime import date


class UserBase(BaseModel):
    email: str


class User(UserBase):
    id: int
    sex: Optional[int]
    city: Optional[int]
    first_name: Optional[str]
    second_name: Optional[str]
    birth_date: Optional[date]
    phone: Optional[str]
    class Config:
        orm_mode=True


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    sex: Optional[int]
    city: Optional[int]
    first_name: Optional[str]
    second_name: Optional[str]
    birth_date: Optional[date]
    phone: Optional[str]


class Token(BaseModel):
    access_token: str
    token_type: str = 'bearer'
