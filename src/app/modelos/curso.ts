import { Disciplina } from "./disciplina";

export interface Curso {
  cursoId: number;
  cursoNome: string;
  disciplinas: Disciplina[];
}
