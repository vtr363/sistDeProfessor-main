import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  private apiUrl = 'http://localhost:8080/api/usuario';

  constructor(private http: HttpClient) {}

  adicionarProfessor(professor: any): Observable<any> {
    return this.http.post(this.apiUrl, professor);
  }

  atualizarProfessor(professor: any): Observable<any> {
    return this.http.put(this.apiUrl, professor);
  }

  deletarProfessor(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + id);
  }

  obterProfessor(id: number): Observable<any> {
    return this.http.get(this.apiUrl + '/' + id);
  }

  obterProfessorList(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}