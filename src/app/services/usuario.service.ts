import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../modelos/usuario';

@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  private apiUrl = 'http://localhost:8080/api/usuario';

  constructor(private http: HttpClient) {}

  adicionarProfessor(professor: any): Observable<any> {
    return this.http.post(this.apiUrl, professor);
  }

  atualizarProfessor(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  getProfessorList(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  buscarUsuario(): Observable<Usuario> {
    return this.http.get<Usuario>(this.apiUrl);
  }

  deletarProfessor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}