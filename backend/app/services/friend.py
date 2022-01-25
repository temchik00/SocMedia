from typing import List
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_session
from models.user import User
import tables


class FriendService:
    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

    def add_friend(self, friend_id, user_id) -> User:
        friend = self.session.query(tables.User).filter_by(id=friend_id).first()
        if not friend:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        friendship = self.session.query(tables.Friend).filter_by(user_id=user_id, friend_id=friend_id).first()
        if friendship:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT)
        friendship1 = tables.Friend(user_id=user_id, friend_id=friend_id)
        self.session.add(friendship1)
        friendship2 = tables.Friend(user_id=friend_id, friend_id=user_id)
        self.session.add(friendship2)
        self.session.commit()
        return friend
    
    def get_all_friends(self, user_id) -> List[User]:
        friendships = self.session.query(tables.Friend).filter_by(user_id=user_id).all()
        user_ids = [friendship.friend_id for friendship in friendships]
        return self.session.query(tables.User).filter(tables.User.id.in_(user_ids)).all()

    def delete_friend(self, friend_id, user_id):
        friendship = self.session.query(tables.Friend).filter_by(user_id=user_id, friend_id=friend_id).first()
        if not friendship:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        friendship1 = self.session.query(tables.Friend).filter_by(user_id=user_id, friend_id=friend_id).first()
        self.session.delete(friendship1)
        friendship2 = self.session.query(tables.Friend).filter_by(user_id=friend_id, friend_id=user_id).first()
        self.session.delete(friendship2)
        self.session.commit()
        return

    def get_friend(self, friend_id, user_id) -> User:
        friendship = self.session.query(tables.Friend).filter_by(user_id=user_id, friend_id=friend_id).first()
        if not friendship:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        return self.session.query(tables.User).filter_by(id=friend_id).first()


