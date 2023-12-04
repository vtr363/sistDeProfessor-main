import { Usuario } from "./usuario";

export interface Disciplina {
  disciplinaId: string;
  disciplinaNome: string;
  disciplinaCarga: number; // Cada disciplina tem carga de 2 horas.
  trimestre: string;
  usuario: Usuario;
}