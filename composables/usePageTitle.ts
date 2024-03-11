export const usePageTitle: () => Ref<string> = () => useState('pageTitle', () => '');

export const usePageTitleChange = (newTitle: string) => (usePageTitle().value = newTitle);
