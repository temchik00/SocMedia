from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from passlib.hash import bcrypt
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from dateutil.relativedelta import relativedelta

import tables
from models.user import User, UserCreate, UserUpdate
from models.user import Token
from settings import settings
from database import get_session


oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/user/sign_in/')


def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
) -> User:
    return UserService.validate_token(token, session)


class UserService:
    @classmethod
    def verify_password(
        cls, plain_password: str,
        hashed_password: str
    ) -> bool:
        return bcrypt.verify(plain_password, hashed_password)

    @classmethod
    def hash_password(cls, password: str) -> str:
        return bcrypt.hash(password)

    @classmethod
    def validate_token(cls, token: str, session: Session) -> User:
        try:
            payload = jwt.decode(
                token,
                settings.secret,
                algorithms=[settings.jwt_algorithm]
            )
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Could not validate credentials',
                headers={'WWW-Authenticate': 'Bearer'}
            ) from None
        user_id = payload.get('sub')
        user = session.query(tables.User).filter_by(id=user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Could not validate credentials',
                headers={'WWW-Authenticate': 'Bearer'}
            )
        return user

    @classmethod
    def create_token(cls, user: User) -> Token:
        now = datetime.utcnow()
        payload = {
            'iat': now,
            'nbf': now,
            'exp': now + timedelta(seconds=settings.jwt_lifetime),
            'sub': str(user.id)
        }
        token = jwt.encode(
            payload,
            settings.secret,
            algorithm=settings.jwt_algorithm
        )
        return Token(access_token=token)

    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

    def register_new_user(self, user_data: UserCreate) -> Token:
        user = self.session.query(tables.User).\
            filter(tables.User.email == user_data.email).first()
        if user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail='Email already taken'
            )
        user = tables.User(
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            email=user_data.email,
            password=self.hash_password(user_data.password)
        )
        self.session.add(user)
        self.session.commit()
        return self.create_token(user)

    def authenticate_user(self, email: str, password: str) -> Token:
        exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect email or password',
            headers={'WWW-Authenticate': 'Bearer'}
        )

        user = self.session.query(tables.User).\
            filter(tables.User.email == email).first()
        if not user:
            raise exception

        if not self.verify_password(password, user.password):
            raise exception

        return self.create_token(user)

    def update_user(self, user_id: int, user_data: UserUpdate) -> User:
        user = self.session.query(tables.User).filter_by(id=user_id).first()
        for field, value in user_data:
            if value:
                setattr(user, field, value)
        self.session.commit()
        return user

    def get_user(self, user_id: int) -> User:
        user = self.session.query(tables.User).filter_by(id=user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        return user

    def filter_users(
        self,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        sex: Optional[int] = None,
        city: Optional[int] = None,
        younger: Optional[int] = None,
        older: Optional[int] = None,
        page_number: Optional[int] = None,
        exclude_user: Optional[int] = None
    ) -> List[User]:
        query = self.session.query(tables.User)
        if first_name:
            query = query.filter(tables.User.first_name.contains(first_name))
        if last_name:
            query = query.filter(tables.User.last_name.contains(last_name))
        if city:
            query = query.filter(tables.User.city == city)
        if sex:
            query = query.filter(tables.User.sex == sex)
        if younger:
            date = datetime.now() - relativedelta(years=younger)
            query = query.filter(tables.User.birth_date > date)
        if older:
            date = datetime.now() - relativedelta(years=older)
            query = query.filter(tables.User.birth_date < date)
        if exclude_user:
            query = query.filter(tables.User.id != exclude_user)
        query = query.order_by(tables.User.id.desc()).\
            limit(settings.user_count_in_responce)
        if page_number:
            query = query.offset(page_number * settings.user_count_in_responce)
        return query.all()

    def get_user_from_token(self, token: str) -> Optional[User]:
        try:
            user = UserService.validate_token(token, self.session)
            return user
        except Exception:
            return None
