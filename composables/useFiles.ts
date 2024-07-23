import type { FileDataFromDb } from '~/types/FilesDataFromDb';

export const useFilesState = () => useState<FileDataFromDb[]>('files', () => []);
