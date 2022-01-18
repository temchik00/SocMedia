from fastapi import APIRouter
from .ftp import router as ftp_router
from .user import router as user_router
from .city import router as city_router
from .sex import router as sex_router

router = APIRouter()
router.include_router(ftp_router)
router.include_router(user_router)
router.include_router(city_router)
router.include_router(sex_router)