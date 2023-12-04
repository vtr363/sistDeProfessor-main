
export interface Usuario {

  usuarioId: number;
  usuarioNome: string;
  usuarioCpf: string;
  usuarioEmail: string;
  professorCarga: number;
  curEscolhidos?: string[];
  discEscolhidas?: string[];
  tipoContratacao: string;
  tipoUsuario: String; // Professor, Coordenador ou Administrador.
  
}
