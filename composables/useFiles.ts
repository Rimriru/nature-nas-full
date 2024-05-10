import type FileDataFromDb from '~/types/FilesDataFromDb';

export const useFilesState = () => useState<FileDataFromDb[]>('files', () => []);

export const useFiles = async () => {
  const allFilesFromDb = await $fetch('/api/files');
  return allFilesFromDb as FileDataFromDb[];
};
