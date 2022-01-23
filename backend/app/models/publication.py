from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class PublicationBase(BaseModel):
    content: Optional[str]
    image: Optional[str]



class Publication(PublicationBase):
    id: int
    user_id: int
    time_posted: datetime
    class Config:
        orm_mode = True


class PublicationCreate(PublicationBase):
    pass


class PublicationLikes(BaseModel):
    user_ids: List[int]