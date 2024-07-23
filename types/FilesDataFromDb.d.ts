interface IFile {
  name: string;
  file: string;
  category?: string;
}

interface FileDataFromDb extends IFile {
  _id: string;
}

export { IFile, FileDataFromDb };
