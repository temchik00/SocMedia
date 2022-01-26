from typing import List
from fastapi import APIRouter, Depends, status
from fastapi.responses import Response
from models.publication import Publication, PublicationCreate, PublicationLikes
from services.publication import PublicationService
from models.user import User
from services.user import get_current_user

router = APIRouter(prefix='/publication')


@router.get('/{publication_id}/likes/', response_model=PublicationLikes)
def get_publication_likes(
    publication_id: int,
    service: PublicationService = Depends()
) -> PublicationLikes:
    return service.get_likes(publication_id)


@router.put('/{publication_id}/like/')
def toggle_like(
    publication_id: int,
    service: PublicationService = Depends(),
    user: User = Depends(get_current_user)
):
    service.toggle_like(publication_id, user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get('/{user_id}/', response_model=List[Publication])
def get_publications(
    user_id: int,
    service: PublicationService = Depends()
) -> List[Publication]:
    return service.get_publications(user_id)


@router.post('/', status_code=status.HTTP_201_CREATED,
             response_model=Publication)
def create_publication(
    publication_info: PublicationCreate,
    service: PublicationService = Depends(),
    user: User = Depends(get_current_user)
) -> Publication:
    return service.create_publication(publication_info, user.id)
