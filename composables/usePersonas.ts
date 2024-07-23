import type { PersonaInstanceFromDb } from '~/types/PersonasDataFromDb';

export const usePersonasState = () => useState<PersonaInstanceFromDb[]>('personas', () => []);
