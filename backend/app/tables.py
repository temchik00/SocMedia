from time import timezone
from sqlalchemy import Column, Integer, VARCHAR, ForeignKey, DateTime, Text, Date
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()


class Sex(Base):
    __tablename__ = 'sex'
    id = Column(Integer, primary_key=True)
    name = Column(VARCHAR(20))


class City(Base):
    __tablename__ = 'city'
    id = Column(Integer, primary_key=True)
    name = Column(VARCHAR(40))


class Friend(Base):
    __tablename__ = 'friend'
    user_id = Column(Integer, ForeignKey('user.id'), primary_key=True)
    friend_id = Column(Integer, ForeignKey('user.id'), primary_key=True)


class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    sex = Column(Integer, ForeignKey('sex.id'))
    city = Column(Integer, ForeignKey('city.id'))
    first_name = Column(VARCHAR(50))
    second_name = Column(VARCHAR(50))
    birth_date = Column(Date)
    phone = Column(VARCHAR(12), unique=True)
    email = Column(VARCHAR(50), nullable=False, unique=True)
    password = Column(VARCHAR(50), nullable=False)
    posts = relationship('publication')


class Publication(Base):
    __tablename__ = "publication"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    content = Column(Text)
    image = Column(VARCHAR(300))
    time_posted = Column(DateTime, server_default=func.now())
    likes = relationship('like')


class Like(Base):
    __tablename__ = 'like'
    user_id = Column(Integer, ForeignKey('user.id'), primary_key=True)
    publication_id = Column(Integer, ForeignKey('publication.id'), primary_key=True)


class Chat(Base):
    __tablename__ = 'chat'
    id = Column(Integer, primary_key=True)
    name = Column(VARCHAR(50))
    image = Column(VARCHAR(300))
    messages = relationship('chat_message')


class ChatMember(Base):
    __tablename__ = 'chat_member'
    user_id = Column(Integer, ForeignKey('user.id'), primary_key=True)
    chat_id = Column(Integer, ForeignKey('chat.id'), primary_key=True)


class ChatMessage(Base):
    __tablename__ = 'chat_message'
    id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey('chat.id'))
    user_id = Column(Integer, ForeignKey('user.id'))
    content = Column(Text)
    time_posted = Column(DateTime(timezone=True), server_default=func.now())
