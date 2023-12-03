import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';


import { ProfessorService } from 'src/app/services/usuario.service';
import { CursoService } from 'src/app/services/curso.service';
import { Curso } from 'src/app/modelos/curso';
import { Disciplina } from 'src/app/modelos/disciplina';

@Component({
  selector: 'app-professor-cadastro',
  templateUrl: './professor-cadastro.component.html',
  styleUrls: ['./professor-cadastro.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatDividerModule, MatButtonModule, FormsModule, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatSelectModule],
})

export class ProfessorCadastroComponent implements OnInit {

  tipoHorarioContratacao: string[] = ['HORISTA', 'PARCIAL', 'INTEGRAL'];
  cursosDisponiveis: Curso[] = [];
  disciplinasDoCurso: Disciplina[] = [];

  usuarioNome: string = '';
  usuarioCpf: string = '';
  usuarioEmail: string = '';
  professorCarga: number = 40;
  tipoContratacao: string = '';
  curso: Curso = { cursoId: 0, cursoNome: '', disciplinas: [] };
  disciplinas: Disciplina[] = [];

  constructor(private snackBar: MatSnackBar,
    private professorService: ProfessorService,
    private cursoService: CursoService) { }

  ngOnInit() {
    this.obterCursosDisponiveis();
  }

  // Busca dos cursos no banco.
  obterCursosDisponiveis() {
    this.cursoService.obterCursos().subscribe(
      (cursos) => {
        this.cursosDisponiveis = cursos;
      },
      (error) => {
        console.error('Erro ao obter cursos', error);
      }
    );
  }

  // Seleciona o curso no dropdown/select.
  cursoSelecionado() {
    if (this.curso) {
      this.disciplinasDoCurso = this.curso.disciplinas;
    } else {
      this.disciplinasDoCurso = [];
      this.disciplinas = [];
    }
  }


  // ==== ANALISAR A LÓGICA DEPOIS COM O PESSOAL ====
  // Lógica para validação da Carga Semanal baseado na escolha do tipo (Horista, Parcial ou Integral).
  validarCargaSemanal() {
    // Horista.
    if (this.tipoContratacao === 'HORISTA' && this.professorCarga !== null) {
      this.professorCarga = Math.min(40, Math.max(2, this.professorCarga));
      this.professorCarga = this.professorCarga - (this.professorCarga % 2);

      // Parcial.
    } else if (this.tipoContratacao === 'PARCIAL' && this.professorCarga !== null) {
      this.professorCarga = Math.min(40, Math.max(10, this.professorCarga));
      this.professorCarga = this.professorCarga - (this.professorCarga % 10);

      // Integral.
    } else if (this.tipoContratacao === 'INTEGRAL') {
      this.professorCarga = 40;
    }
  }

  // Função para exibir mensagem de erro usando o MatSnackBar.
  exibirMensagemErro(mensagem: string) {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  // Cadastro de Professor.
  cadastrar() {
    const novoProfessor = {
      usuarioNome: this.usuarioNome,
      usuarioCpf: this.usuarioCpf,
      usuarioEmail: this.usuarioEmail,
      professorCarga: this.professorCarga,
      tipoContratacao: this.tipoContratacao,
      tipoUsuario: "PROFESSOR",
      curEscolhidos: this.curso?.cursoNome,
      discEscolhidos: this.disciplinas.map(d => d.disciplinaNome),
    };
    

    // Validar o campo de nome
    if (!this.usuarioNome || this.usuarioNome.trim() === '') {
      this.exibirMensagemErro('Por favor, preencha o campo de nome.');
      return;
    }

    // Validar o campo de CPF
    if (!this.usuarioCpf || !this.validarCPF(this.usuarioCpf)) {
      this.exibirMensagemErro('Por favor, informe um CPF válido.');
      return;
    }

    // Validar o campo de Tipo de Contratação
    if (!this.tipoContratacao) {
      this.exibirMensagemErro('Por favor, selecione o tipo de contratação.');
      return;
    }

    // Validar o campo de Carga Semanal
    if (this.tipoContratacao === 'HORISTA' || this.tipoContratacao === 'PARCIAL') {
      if (!this.professorCarga || isNaN(this.professorCarga) || this.professorCarga < 2 || this.professorCarga > 40 || this.professorCarga % 2 !== 0) {
        this.exibirMensagemErro('Por favor, informe uma carga semanal válida para contratação Horista ou Parcial.');
        return;
      }
    }

    // Validar o campo de Curso
    if (!this.curso) {
      this.exibirMensagemErro('Por favor, selecione um curso.');
      return;
    }

    // Validar o campo de Disciplinas
    if (!this.disciplinas || this.disciplinas.length === 0) {
      this.exibirMensagemErro('Por favor, selecione pelo menos uma disciplina.');
      return;
    }

    this.professorService.adicionarProfessor(novoProfessor).subscribe(
      () => {

        this.limparCampos();

        this.snackBar.open('Cadastro realizado com sucesso.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      },
      (error) => {
        console.error('Erro ao cadastrar professor.', error);

        // Exibir mensagem de erro
        this.snackBar.open('Erro ao cadastrar professor.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      }
    );
  }

  // Função para validar CPF.
  validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');
    return cpf.length === 11;
  }

  // Limpeza dos campos.
  limparCampos() {
    this.usuarioNome = '';
    this.usuarioCpf = '';
    this.tipoContratacao = '';
    this.usuarioEmail = '';
    this.professorCarga = 40;
    this.curso = { cursoId: 0, cursoNome: '', disciplinas: [] };
    this.disciplinas = [];
    this.disciplinasDoCurso = [];

    this.snackBar.open('Os campos foram limpos.', 'Fechar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  // Validação da Carga Semanal do Horista.
  validarCargaSemanalHorista() {
    if (this.tipoContratacao === 'HORISTA' && this.professorCarga !== null) {
      this.professorCarga = Math.min(40, Math.max(2, this.professorCarga));
      this.professorCarga = this.professorCarga - (this.professorCarga % 2);
    }
  }

  // Validação da Carga Semanal do Parcial.
  validarCargaSemanalParcial() {
    if (this.tipoContratacao === 'PARCIAL' && this.professorCarga !== null) {
      this.professorCarga = Math.min(40, Math.max(10, this.professorCarga));
      this.professorCarga = this.professorCarga - (this.professorCarga % 10);
    }
  }

}