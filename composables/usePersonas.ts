import type { PersonaInstanceFromDb } from '~/types/PersonasDataFromDb';

export const usePersonasState = () => useState<PersonaInstanceFromDb[]>('personas', () => []);

export const usePersonas = async () => {
  const allPersonas = await $fetch('/api/personas');
  return allPersonas;
};
