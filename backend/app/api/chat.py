from typing import List, Optional
from fastapi import (
    APIRouter,
    Depends,
    status,
    WebSocket,
    WebSocketDisconnect,
    Query
)
from models.user import User
from models.chat import Chat, ChatCreate, UsersToAdd
from models.message import Message
from services.user import get_current_user, UserService
from services.chat import ChatService


router = APIRouter(prefix='/chat')


@router.post('/', response_model=Chat, status_code=status.HTTP_201_CREATED)
def create_chat(
    chat_data: ChatCreate,
    service: ChatService = Depends(),
    user: User = Depends(get_current_user)
):
    return service.create_chat(chat_data, user.id)


@router.get('/all/', response_model=List[Chat])
def get_all_chats(
    service: ChatService = Depends(),
    user: User = Depends(get_current_user)
):
    return service.get_all_chats(user.id)


@router.get('/{chat_id}/', response_model=Chat)
def get_chat(
    chat_id: int,
    service: ChatService = Depends(),
    user: User = Depends(get_current_user)
):
    return service.get_chat(chat_id, user.id)


@router.get(
    '/{chat_id}/members/',
    status_code=status.HTTP_201_CREATED,
    response_model=List[User]
)
def get_members(
    chat_id: int,
    service: ChatService = Depends(),
    user: User = Depends(get_current_user)
):
    return service.get_members(chat_id, user.id)


@router.post(
    '/{chat_id}/members/',
    status_code=status.HTTP_201_CREATED,
    response_model=List[User]
)
def add_members(
    chat_id: int,
    members_to_add: UsersToAdd,
    service: ChatService = Depends(),
    user: User = Depends(get_current_user)
):
    return service.add_members(chat_id, user.id, members_to_add)


@router.delete('/{chat_id}/members/', response_model=List[User])
def remove_members(
    chat_id: int,
    members_to_remove: UsersToAdd,
    service: ChatService = Depends(),
    user: User = Depends(get_current_user)
):
    return service.remove_members(chat_id, user.id, members_to_remove)


@router.get('/{chat_id}/messages/', response_model=List[Message])
def get_messages(
    chat_id: int,
    page_size: int,
    message_from: Optional[int] = None,
    service: ChatService = Depends(),
    user: User = Depends(get_current_user)
):
    return service.get_messages(chat_id, user.id, page_size, message_from)


@router.get('/{chat_id}/messages/last_message/', response_model=Message)
def get_last_message(
    chat_id: int,
    service: ChatService = Depends(),
    user: User = Depends(get_current_user)
):
    return service.get_last_message(chat_id, user.id)


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: Message):
        json_message = {
            'id': message.id,
            'content': message.content,
            'time_posted': message.time_posted.isoformat(),
            'user_id': message.user_id
        }
        for connection in self.active_connections:
            await connection.send_json(json_message)


managers = {}


@router.websocket('/chat/{chat_id}/')
async def websocket_endpoint(
    websocket: WebSocket,
    chat_id: int,
    token: Optional[str] = Query(None),
    chatService: ChatService = Depends(),
    userService: UserService = Depends()
):
    user = userService.get_user_from_token(token)
    if user:
        manager = managers.get(chat_id, None)
        if not manager:
            manager = ConnectionManager()
            managers[chat_id] = manager
        await manager.connect(websocket)
        try:
            while True:
                content = await websocket.receive_json()
                message = chatService.add_message(chat_id, user.id, content)
                await manager.broadcast(message)
        except WebSocketDisconnect:
            manager.disconnect(websocket)
