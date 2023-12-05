import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Curso } from 'src/app/modelos/curso';
import { Disciplina } from 'src/app/modelos/disciplina';
import { Usuario } from 'src/app/modelos/usuario';
import { CursoService } from 'src/app/services/curso.service';
import { DisciplinaService } from 'src/app/services/disciplina.service';
import { ProfessorService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-view-coordenador',
  templateUrl: './view-coordenador.component.html',
  styleUrls: ['./view-coordenador.component.css']
})
export class ViewCoordenadorComponent  implements OnInit {
  displayedColumns: string[] = [
    'disciplinaId',
    'disciplinaNome',
    'disciplinaCarga',
    'trimestre',
    'usuario',
  ];

  trimestresList: string[] = [
    "PRIMEIRO_TRIMESTRE",
    "SEGUNDO_TRIMESTRE",
    "TERCEIRO_TRIMESTRE",
    "QUARTO_TRIMESTRE"
  ]

  trimestreSelecionado: any;
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
    private _discService: DisciplinaService,
    private _cursoService: CursoService,
    private _professorService: ProfessorService,
  ) { }

  ngOnInit(): void {
    this.getCursoList();
    this.getProfessoresList();
  }

  async atualizarUsuario(row: any) {
    let disciplina$: Observable<Disciplina> = this._discService.getDisciplina(row.disciplinaId);
    
    disciplina$.subscribe((disciplina: Disciplina) => {
      
      // Assuming 'usuario' is a property of 'disciplina' and exists in your Disciplina type
      disciplina.usuario = row.usuario;
      console.log(disciplina)

      // Assuming atualizarDisciplina also returns an Observable
      this._discService.atualizarDisciplina(row.disciplinaId, disciplina).subscribe(() => {
          // Handle successful update if needed
      }, (error) => {
          // Handle error during update
          console.error(error);
      });
  });
    
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


    this.dataSource = new MatTableDataSource(this.disciplinaList);
    this.dataSource.sort = this.sort;
    this.dataSource._renderChangesSubscription;
    console.log(this.CursoList)

  }

  getProfessoresList() {
    this._professorService.obterProfessorList().subscribe({
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

  aplicarFiltroTrimestre(trimeste: string) {
    this.dataSource.filter = trimeste.trim().toLowerCase();

    if (this.dataSource.paginator) {

      this.dataSource.paginator.firstPage();
    }
  }


  // FUNCIONANDO FAVOR N MECHER !!!!!! //
  exportCsv(): void {
    // Inicializa uma string vazia chamada 'csv'.
    let csv = '';
  
    // Loop para percorrer cada coluna no array 'columns'.
    for (let column = 0; column < this.displayedColumns.length; column++) {
      // Adiciona o nome da coluna seguido por um ponto e vírgula à string 'csv'.
      csv += this.displayedColumns[column] + ';';
  
      // Remove qualquer quebra de linha na string 'csv'.
      csv = csv.replace(/\n/g, '');
    }
  
    // Remove o último ponto e vírgula da string 'csv' e adiciona uma quebra de linha.
    csv = csv.substring(0, csv.length - 1) + '\n';
  
    // Obtém as linhas filtradas do objeto que possui os dados.
    const rows = this.dataSource.data;
    
  
    // Loop para percorrer cada linha nas linhas filtradas.
    for (let row = 0; row < rows.length; row++) {

      let keys = this.displayedColumns

      // Loop para percorrer cada elemento na linha atual.
      keys.forEach(key => {
        if (key != keys[keys.length-1]){
          csv += rows[row][key] + ';';
        }else {
          csv += rows[row][key]?.usuarioNome + ',';
        }
        // Adiciona o valor do elemento na string 'csv'.

      })
      
      // Remove o último ponto e vírgula da string 'csv' e adiciona uma quebra de linha.
      csv = csv.substring(0, csv.length - 1) + '\n';
    }
  
    // Remove a última quebra de linha da string 'csv'.
    csv = csv.substring(0, csv.length - 1) + '\n';
  
    // Cria um elemento de documento (link) usando JavaScript.
    const docElement = document.createElement('a');
  
    // Adiciona o caractere BOM (Byte Order Mark) universal à string 'csv'.
    const universalBOM = '\uFEFF';
  
    // Concatena o nome do arquivo com a data atual para formar o nome do arquivo completo.
    let filename = 'Alocação-de-Professores_';
    let currentDateString = new Date()
    filename = filename.concat(currentDateString.toString());
    const fileNameWithType = filename.concat('.csv');
  
    // Configura o link para apontar para os dados CSV, com codificação UTF-8.
    docElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(universalBOM + csv);
  
    // Define o alvo do link como '_blank' para abrir em uma nova guia/janela.
    docElement.target = '_blank';
  
    // Define o atributo de download do link com o nome do arquivo CSV.
    docElement.download = fileNameWithType;
  
    // Simula um clique no link para iniciar o download do arquivo CSV.
    docElement.click();
  }
}
