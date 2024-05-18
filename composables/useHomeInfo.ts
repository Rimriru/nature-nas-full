import type HomeInfo from '~/types/HomeInfoDataFromDb';

export const useHomeInfoState = () => useState<HomeInfo | null>('homeInfo', () => null);

export const useHomeInfo = async () => {
  const homeInfo = await $fetch('/api/home-info');
  return homeInfo;
};
