from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import List, Optional
from models.user import (
    User,
    UserCreate,
    UserUpdate,
    Token,
    EmailExists
)
from services.user import UserService, get_current_user


router = APIRouter(prefix='/user')


@router.post('/sign_up/', response_model=Token,
             status_code=status.HTTP_201_CREATED)
def sign_up(
    user_data: UserCreate,
    service: UserService = Depends()
):
    return service.register_new_user(user_data)


@router.post('/sign_in/', response_model=Token,
             status_code=status.HTTP_201_CREATED)
def sign_in(
    form_data: OAuth2PasswordRequestForm = Depends(),
    service: UserService = Depends()
):
    return service.authenticate_user(
        form_data.username,
        form_data.password
    )


@router.get('/exists/{email}/', response_model=EmailExists)
def email_exists(
    email: str,
    service: UserService = Depends()
):
    return EmailExists(exists=service.exists(email))


@router.get('/filter/', response_model=List[User])
def filter_users(
    first_name: Optional[str] = None,
    last_name: Optional[str] = None,
    sex: Optional[int] = None,
    city: Optional[int] = None,
    younger: Optional[int] = None,
    older: Optional[int] = None,
    page_number: Optional[int] = None,
    exclude_user: Optional[int] = None,
    service: UserService = Depends()
):
    return service.filter_users(
        first_name,
        last_name,
        sex,
        city,
        younger,
        older,
        page_number,
        exclude_user
    )


@router.get('/', response_model=User)
def get_self(user: User = Depends(get_current_user)):
    return user


@router.get('/{user_id}/', response_model=User)
def get_user(
    user_id: int,
    service: UserService = Depends()
):
    return service.get_user(user_id)


@router.patch('/', response_model=User)
def update_self(
    user_data: UserUpdate,
    user: User = Depends(get_current_user),
    service: UserService = Depends()
):
    return service.update_user(user.id, user_data)
