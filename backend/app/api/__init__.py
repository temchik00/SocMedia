from fastapi import APIRouter
from .ftp import router as ftp_router

router = APIRouter()
router.include_router(ftp_router)