from typing import List
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
import tables
from models.publication import Publication, PublicationCreate, PublicationLikes
from database import get_session

class PublicationService:
    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

    def get_publication(self, publication_id: int) -> Publication:
        publication = self.session.query(tables.Publication).filter_by(id=publication_id).first()
        if not publication:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        else:
            return publication

    def get_publications(self, user_id: int) -> List[Publication]:
        return self.session.query(tables.Publication).\
            filter(tables.Publication.user_id == user_id).\
            order_by(tables.Publication.id.desc()).all()

    def create_publication(self, publication_info: PublicationCreate, user_id: int) -> Publication:
        publication = tables.Publication()
        for field, value in publication_info:
            setattr(publication, field, value)
        publication.user_id = user_id
        self.session.add(publication)
        self.session.commit()
        return publication

    def get_likes(self, publication_id: int) -> PublicationLikes:
        self.get_publication(publication_id)
        likes = self.session.query(tables.Like).filter(tables.Like.publication_id == publication_id).all()
        user_ids=[]
        for like in likes:
            user_ids.append(like.user_id)
        return PublicationLikes(user_ids=user_ids)

    def toggle_like(self, publication_id: int, user_id: int): 
        self.get_publication(publication_id)
        like = self.session.query(tables.Like).filter_by(publication_id=publication_id, user_id=user_id).first()
        if like:
            self.session.delete(like)
        else:
            like = tables.Like(publication_id=publication_id, user_id=user_id)
            self.session.add(like)
        self.session.commit()