from typing import List
from fastapi import APIRouter, Depends, status
from models.sex import Sex, SexCreate
from services.sex import SexService


router = APIRouter(prefix='/sex')


@router.get('/{sex_id}/', response_model=Sex)
def get_sex(sex_id: int, service: SexService = Depends()):
    return service.get_sex(sex_id)


@router.get('/', response_model=List[Sex])
def get_sexes(service: SexService = Depends()):
    return service.get_sexes()


@router.post('/', response_model=Sex, status_code=status.HTTP_201_CREATED)
def add_sex(sex_data: SexCreate, service: SexService = Depends()):
    return service.create_sex(sex_data)
