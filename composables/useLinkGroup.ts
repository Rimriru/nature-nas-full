import type { LinkGroup } from '~/types/LinkDataFromDb';

export const useLinkGroupsState: () => globalThis.Ref<LinkGroup[] | []> = () =>
  useState('links', () => []);

export const useLinkGroups = async () => {
  const { data } = await useFetch('/api/groups');

  if (!data.value) {
    return [];
  } else {
    return data as unknown as LinkGroup[];
  }
};
