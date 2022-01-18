from fastapi import UploadFile, HTTPException, status, Depends
from os import listdir, getcwd
from os.path import join, isfile


class FtpService:
    def __init__(self):
        self.filedir = join(getcwd(), 'app', 'files')

    async def save(self, file:UploadFile):
        number: int = len(listdir(self.filedir))
        filename: str = f'{number}.{file.filename.split(".")[-1]}'
        with open(join(self.filedir, filename), 'wb') as image:
            content = await file.read()
            image.write(content)
            image.close()
        return filename
    
    def get_path(self, filename: str):
        filepath: str = join(self.filedir, filename)
        if isfile(filepath):
            return filepath
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
