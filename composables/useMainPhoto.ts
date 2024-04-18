import type Photo from '~/types/MainPhotoDataFromDb';

export const useMainPhotoState = () => useState<Photo[]>('mainPhoto', () => []);

export const useMainPhotoRequest = async () => {
  const mainPhoto = await $fetch('/api/main-photo');
  return mainPhoto;
};
