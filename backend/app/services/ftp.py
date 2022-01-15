from fastapi import UploadFile
from os import listdir, getcwd
from os.path import join


class FtpService:
    def __init__(self):
        self.filedir = join(getcwd(), 'files')

    async def save(self, file:UploadFile):
        number = len(listdir(self.filedir))
        filename = f'{number}.{file.filename.split(".")[-1]}'
        with open(join(self.filedir, filename), 'wb') as image:
            content = await file.read()
            image.write(content)
            image.close()
        return filename
    
    def get_path(self, filename: str):
        return join(self.filedir, filename)
