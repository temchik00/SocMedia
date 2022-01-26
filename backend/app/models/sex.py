from pydantic import BaseModel


class SexBase(BaseModel):
    name: str


class Sex(SexBase):
    id: int

    class Config:
        orm_mode = True


class SexCreate(SexBase):
    pass


class SexUpdate(SexBase):
    pass
