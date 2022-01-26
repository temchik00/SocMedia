from typing import List
from fastapi import HTTPException, status, Depends
from database import get_session
from sqlalchemy.orm import Session
from models.city import City, CityCreate
import tables


class CityService:
    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

    def create_city(self, city_data: CityCreate) -> City:
        city = tables.City(name=city_data.name)
        self.session.add(city)
        self.session.commit()
        return city

    def get_city(self, city_id: int) -> City:
        city = self.session.query(tables.City).filter_by(id=city_id).first()
        if not city:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        return city

    def get_cities(self) -> List[City]:
        cities = self.session.query(tables.City).all()
        return cities
