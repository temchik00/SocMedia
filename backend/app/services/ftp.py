import hashlib
from fastapi import UploadFile, HTTPException, status
from os import getcwd
from os.path import join, isfile


class FtpService:
    def __init__(self):
        self.filedir = join(getcwd(), 'app', 'files')

    async def save(self, file: UploadFile):
        hasher = hashlib.new('sha256')
        content = await file.read()
        hasher.update(content)
        filename = hasher.hexdigest()
        # number: int = len(listdir(self.filedir))
        full_filename: str = f'{filename}.{file.filename.split(".")[-1]}'
        if (not isfile(full_filename)):
            with open(join(self.filedir, full_filename), 'wb') as image:
                image.write(content)
                image.close()
        return full_filename

    def get_path(self, filename: str):
        filepath: str = join(self.filedir, filename)
        if isfile(filepath):
            return filepath
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
