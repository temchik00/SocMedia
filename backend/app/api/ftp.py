from fastapi import APIRouter, UploadFile, File, Depends
from fastapi.responses import FileResponse, JSONResponse
from services.ftp import FtpService

router = APIRouter(
    prefix='/file'
)

@router.post("/")
async def upload_file(file:UploadFile = File(...), service: FtpService=Depends()):
    filename = await service.save(file)
    return JSONResponse(content={'filename': filename})


@router.get("/{filename}/")
def get_file(filename: str, service: FtpService=Depends()):
    return FileResponse(path=service.get_path(filename))
