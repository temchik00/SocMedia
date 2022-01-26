from typing import List
from pydantic import BaseModel


class ChatBase(BaseModel):
    name: str
    image: str


class Chat(ChatBase):
    id: int

    class Config:
        orm_mode = True


class ChatCreate(ChatBase):
    pass


class UsersToAdd(BaseModel):
    user_ids: List[int]
