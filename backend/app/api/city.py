from typing import List
from fastapi import APIRouter, Depends, status
from models.city import City, CityCreate
from services.city import CityService


router = APIRouter(prefix='/city')

@router.get('/{city_id}/', response_model=City)
def get_city(city_id: int, service: CityService = Depends()):
    return service.get_city(city_id)

@router.get('/', response_model=List[City])
def get_cities(service: CityService = Depends()):
    return service.get_cities()

@router.post('/', response_model=City, status_code=status.HTTP_201_CREATED)
def add_city(city_data: CityCreate, service: CityService = Depends()):
    return service.create_city(city_data)