import type Photo from '~/types/MainPhotoDataFromDb';

export const useMainPhotoState = () => useState<Photo[]>('mainPhoto', () => []);
