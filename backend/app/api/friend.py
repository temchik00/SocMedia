from typing import List
from fastapi import APIRouter, Depends, status, Response
from services.friend import FriendService
from services.user import get_current_user
from models.user import User


router = APIRouter(prefix='/friend')

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=User)
def add_friend(
    friend_id: int,
    service: FriendService = Depends(),
    user: User = Depends(get_current_user)
):
    return service.add_friend(friend_id, user.id)

@router.delete('/{friend_id}/')
def delete_friend(
    friend_id: int,
    service: FriendService = Depends(),
    user: User = Depends(get_current_user)
):
    service.delete_friend(friend_id, user.id)
    return Response(status_code=status.HTTP_200_OK)

@router.get('/all/', response_model=List[User])
def get_all_friends(
    service: FriendService = Depends(),
    user: User = Depends(get_current_user)
):
    return service.get_all_friends(user.id)

@router.get('/{friend_id}/', response_model=User)
def get_friend(
    friend_id: int,
    service: FriendService = Depends(),
    user: User = Depends(get_current_user)
):
    return service.get_friend(friend_id, user.id)