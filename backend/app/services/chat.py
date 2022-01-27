from typing import List, Optional
from fastapi import Depends, status, HTTPException
from sqlalchemy.orm import Session
from database import get_session
from models.user import User
from models.chat import Chat, ChatCreate, UsersToAdd
from models.message import Message
import tables


class ChatService:
    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

    def __in_chat__(self, chat_id: int, user_id: int) -> bool:
        membership = self.session.query(tables.ChatMember).\
            filter_by(user_id=user_id, chat_id=chat_id).first()
        if not membership:
            return False
        return True

    def create_chat(self, chat_data: ChatCreate, user_id: int) -> Chat:
        chat = tables.Chat(name=chat_data.name, image=chat_data.image)
        self.session.add(chat)
        self.session.flush()
        self.session.refresh(chat)
        member = tables.ChatMember(chat_id=chat.id, user_id=user_id)
        self.session.add(member)
        self.session.commit()
        return chat

    def get_all_chats(self, user_id: int) -> List[Chat]:
        memberships = self.session.query(tables.ChatMember).\
            filter_by(user_id=user_id).all()
        chat_ids = [membership.chat_id for membership in memberships]
        return self.session.query(tables.Chat).\
            filter(tables.Chat.id.in_(chat_ids)).all()

    def get_chat(self, chat_id: int, user_id: int) -> Chat:
        if not self.__in_chat__(chat_id, user_id):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        chat = self.session.query(tables.Chat).filter_by(id=chat_id).first()
        if not chat:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        return chat

    def get_members(self, chat_id: int, user_id: int) -> List[User]:
        if not self.__in_chat__(chat_id, user_id):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        memberships = self.session.query(tables.ChatMember).\
            filter_by(chat_id=chat_id).all()
        user_ids = [membership.user_id for membership in memberships]
        return self.session.query(tables.User).\
            filter(tables.User.id.in_(user_ids)).all()

    def add_members(
        self, chat_id: int, user_id: int,
        members_to_add: UsersToAdd
    ) -> List[User]:
        if not self.__in_chat__(chat_id, user_id):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        for member_id in members_to_add.user_ids:
            if self.__in_chat__(chat_id, member_id):
                raise HTTPException(status_code=status.HTTP_409_CONFLICT)
            membership = tables.ChatMember(user_id=member_id, chat_id=chat_id)
            self.session.add(membership)
        self.session.commit()
        memberships = self.session.query(tables.ChatMember).\
            filter_by(chat_id=chat_id).all()
        user_ids = [membership.user_id for membership in memberships]
        return self.session.query(tables.User).\
            filter(tables.User.id.in_(user_ids)).all()

    def remove_members(
        self, chat_id: int, user_id: int,
        members_to_remove: UsersToAdd
    ) -> List[User]:
        if not self.__in_chat__(chat_id, user_id):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        for member_id in members_to_remove.user_ids:
            if not self.__in_chat__(chat_id, member_id):
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
            membership = self.session.query(tables.ChatMember).\
                filter_by(chat_id=chat_id, user_id=member_id).first()
            self.session.delete(membership)
        self.session.commit()
        memberships = self.session.query(tables.ChatMember).\
            filter_by(chat_id=chat_id).all()
        user_ids = [membership.user_id for membership in memberships]
        return self.session.query(tables.User).\
            filter(tables.User.id.in_(user_ids)).all()

    def add_message(self, chat_id: int, user_id: int, content: str) -> Message:
        message = tables.ChatMessage(
            chat_id=chat_id, user_id=user_id, content=content
        )
        self.session.add(message)
        self.session.commit()
        return message

    def get_messages(
        self, chat_id: int, user_id: int,
        page_size: int, message_from: Optional[int] = None
    ) -> List[Message]:
        if not self.__in_chat__(chat_id, user_id):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        query = self.session.query(tables.ChatMessage).\
            filter_by(chat_id=chat_id).order_by(tables.ChatMessage.id.desc())
        if message_from:
            query = query.filter(tables.ChatMessage.id < message_from)
        query = query.limit(page_size)
        return query.all()[::-1]

    def get_last_message(self, chat_id: int, user_id: int) -> Message:
        if not self.__in_chat__(chat_id, user_id):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        message = self.session.query(tables.ChatMessage).\
            filter_by(chat_id=chat_id).\
            order_by(tables.ChatMessage.id.desc()).first()
        if not message:
            return HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        return message
