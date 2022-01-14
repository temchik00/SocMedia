from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse, JSONResponse
from os import listdir, getcwd
from os.path import join

router = APIRouter(
    prefix='/file'
)

@router.post("/")
async def upload_file(file:UploadFile = File(...)):
    filedir = join(getcwd(), 'files')
    number = len(listdir(filedir))
    filename = f'{number}.{".".join(file.filename.split(".")[1:])}'
    with open(join(filedir, filename), 'wb') as image:
        content = await file.read()
        image.write(content)
        image.close()
    return JSONResponse(content={'filename': filename})


@router.get("/{filename}")
def get_file(filename: str):
    filedir = join(getcwd(), 'files')
    filepath = join(filedir, filename)
    return FileResponse(path=filepath)



