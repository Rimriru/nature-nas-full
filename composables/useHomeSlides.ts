import type Slide from '~/types/SlideDataFromDb';

export const useHomeSlidesState = () => useState<Slide[]>('slides', () => []);

export const useHomeSlides = async () => {
  const mainPhoto = await $fetch('/api/slides');
  return mainPhoto;
};
