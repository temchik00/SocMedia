from typing import List
from fastapi import HTTPException, status, Depends
from database import get_session
from sqlalchemy.orm import Session
from models.sex import Sex, SexCreate
import tables


class SexService:
    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

    def create_sex(self, sex_data: SexCreate) -> Sex:
        sex = tables.Sex(name=sex_data.name)
        self.session.add(sex)
        self.session.commit()
        return sex

    def get_sex(self, sex_id: int) -> Sex:
        sex = self.session.query(tables.Sex).filter_by(id=sex_id).first()
        if not sex:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        return sex

    def get_sexes(self) -> List[Sex]:
        cities = self.session.query(tables.Sex).all()
        return cities
