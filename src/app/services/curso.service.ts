import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from '../modelos/curso';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  private apiUrl = 'http://localhost:8080/api/curso';

  constructor(private http: HttpClient) { }

  obterCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl);
  }

  // Método atualizado para enviar apenas as propriedades necessárias para a atualização
  atualizarCurso(cursoId: number, updatedCurso: any): Observable<any> {
    const url = `${this.apiUrl}/${cursoId}`;
    
    // Crie um objeto contendo apenas as propriedades necessárias para a atualização
    const requestBody = {
      cursoNome: updatedCurso.cursoNome, // Adapte conforme necessário
    };

    return this.http.put(url, requestBody);
  }

  // Seu método existente para atualizar curso, disciplina e usuário
  atualizarCursoDisciplinaUsuario(cursoId: number, disciplinaId: string, usuarioId: number, updatedUsuario: any): Observable<any> {
    const url = `${this.apiUrl}/${cursoId}/disciplinas/${disciplinaId}/usuarios/${usuarioId}`;
    return this.http.put(url, updatedUsuario);
  }
}
