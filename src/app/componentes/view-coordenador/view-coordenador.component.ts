import { Curso } from './../../modelos/curso';
import { Usuario } from './../../modelos/usuario';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Disciplina } from 'src/app/modelos/disciplina';
import { CoreService } from 'src/app/services/core.service';
import { DisciplinaService } from 'src/app/services/disciplina.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CursoService } from 'src/app/services/curso.service';
import { ProfessorService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-view-coordenador',
  templateUrl: './view-coordenador.component.html',
  styleUrls: ['./view-coordenador.component.css']
})
export class ViewCoordenadorComponent implements OnInit {
  displayedColumns: string[] = [
    'usuarioId',
    'disciplinaNome',
    'disciplinaCarga',
    'trimestre',
    'action',
  ];

  cursoSelecionado = '';
  profSelecionado: Usuario[] = [];
  filtroCurso: FormControl = new FormControl('');
  dataSource!: MatTableDataSource<any>;
  getCurso!: Curso[];
  novoCurso!: Curso[];


  disciplinaList: Disciplina[] = [];
  CursoList: Curso[] = [];
  professoresList: Usuario[] = [];
  getUsuario: Usuario[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _discService: DisciplinaService,
    private _coreService: CoreService,
    private _cursoService: CursoService,
    private _professorService: ProfessorService,
  ) { }

  ngOnInit(): void {
    this.getCursoList();
    this.getProfessoresList();
  }


  onSelectChange(row: Curso): void {
    this.atualizarUsuario()
  }

  atualizarUsuario() {
    this._cursoService.obterCursos().subscribe(a => {
      this.getCurso = a.map(b => b);
    })
    if (this.getCurso) {
      this.getCurso.find(a => a);
    }

  }


  getCursoList() {
    this._cursoService.obterCursos().subscribe({
      next: (res) => {
        this.CursoList = res;
        this.getDisciplinaList(this.CursoList[0].cursoNome);
      },
      error: console.log,
    });
  }

  getDisciplinaList(cursoNome: string) {
    const curso: Curso | undefined = this.CursoList.find(c => c.cursoNome === cursoNome);

    this.cursoSelecionado = curso?.cursoNome ?? '';
    this.disciplinaList = curso?.disciplinas ?? [];


    // Supondo que você tenha um objeto 'curso' como você mostrou anteriormente
    const usuariosEncontrados: Usuario[] = [];

    curso?.disciplinas?.forEach(disciplina => {
      const usuario = disciplina.usuario;
      if (usuario) {
        usuariosEncontrados.push(usuario);
      }
    });

    if (usuariosEncontrados.length > 0) {
      console.log("Usuários encontrados nas disciplinas:", usuariosEncontrados);
    } else {
      console.log("Nenhum usuário encontrado em nenhuma disciplina.");
    }



    this.dataSource = new MatTableDataSource(this.disciplinaList);
    this.dataSource.sort = this.sort;
    this.dataSource._renderChangesSubscription;

  }

  getProfessoresList() {
    this._professorService.getProfessorList().subscribe({
      next: (res) => {
        this.professoresList = res.filter((professor: { tipoUsuario: string; }) => professor.tipoUsuario === 'PROFESSOR');
      },
      error: console.log,
    });
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  aplicarFiltroCurso(cursoNome: string) {
    this.getDisciplinaList(cursoNome);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deletarDisciplina(id: number) {
    this._discService.deletarDisciplina(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Disciplina removida!', 'done');
        this.getDisciplinaList(this.cursoSelecionado);
      },
      error: console.log,
    });
  }
}
