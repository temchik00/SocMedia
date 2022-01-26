from pydantic import BaseModel
from datetime import datetime


class MessageBase(BaseModel):
    content: str


class Message(MessageBase):
    id: int
    chat_id: int
    user_id: int
    time_posted: datetime

    class Config:
        orm_mode = True


class MessageCreate(MessageBase):
    pass
