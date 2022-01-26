from fastapi import APIRouter, UploadFile, File, Depends, status
from fastapi.responses import FileResponse, JSONResponse

from services.ftp import FtpService
from services.user import get_current_user
from models.user import User


router = APIRouter(
    prefix='/file'
)


@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    service: FtpService = Depends(),
    _: User = Depends(get_current_user)
):
    filename = await service.save(file)
    return JSONResponse(content={'filename': filename},
                        status_code=status.HTTP_201_CREATED)


@router.get("/{filename}/")
def get_file(filename: str, service: FtpService = Depends()):
    return FileResponse(path=service.get_path(filename))
