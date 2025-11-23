import { Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import type { TemplateRef , OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import type { FormGroup } from '@angular/forms';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import ProfessorService from '../../../services/professor/professor.service';
import type { Disciplina } from '../../../models/disciplina.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DisciplinaService } from '../../../services/disciplina/disciplina.service';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import type { Curso } from '../../../models/curso.model';
import type { Observable } from 'rxjs';
import type { Professor } from '../../../models/professor.model';
import type { BuscarCursosProfessorResponse } from '../../../types/professor.types';

@Component({
  selector: 'app-edit-professor-modal',
  standalone: false,
  templateUrl: './edit-professor-modal.html',
  styleUrl: './edit-professor-modal.css',
})
export class EditProfessorModal implements OnInit {
  form: FormGroup;

  @Input() usuarioId: number | null = null;

  @Output() fechar = new EventEmitter<boolean>();
  private fb = inject(FormBuilder);
  private snackbarService = inject(SnackBarService);
  private modalService = inject(NgbModal);

  private professorService = inject(ProfessorService);
  private usuarioService = inject(UsuarioService);
  private disciplinaService = inject(DisciplinaService);

  listaDisciplinas: Disciplina[] = [];
  listaCursos: BuscarCursosProfessorResponse[] = [];

  @ViewChild('EditProfessor')
  modalTemplate!: TemplateRef<EditProfessorModal>;

  listaTodasDisciplinas: Disciplina[] = []; // Todas as do sistema (para o select)
  disciplinaSelecionadaControl = new FormControl(null, Validators.required); // O controle do Select

  @ViewChild('modalAddDisciplina') modalAddDisciplina!: TemplateRef<any>;

  /* --- CONFIGURAÇÃO INICIAL DO FORMULÁRIO --- */
  constructor() {
    this.form = this.fb.group({
      usuarioId: [null],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      registro: ['', Validators.required],
      cargoId: [null],
    });
  }

  /* --- INICIALIZAÇÃO E VERIFICAÇÃO DE ROTA --- */
  ngOnInit(): void {
    if (this.usuarioId) {
      this.identificarEBuscarDados(this.usuarioId);
    }
  }

  abrirInstaciaModal() {
    this.modalService.open(this.modalTemplate, {
      backdrop: 'static',
      centered: true,
      size: 'lg',
    });
  }

  identificarEBuscarDados(id: number) {
    this.usuarioService.buscarUsuarioPorId(id).subscribe({
      next: (usuario) => {
        const cargo = usuario.cargoId;

        if (this.isCargoAcademico(cargo)) {
          this.buscarDadosProfessor(id);
          this.carregarDisciplinas();
          this.carregarCursos();
        } else {
          this.buscarDadosAuxiliar(usuario);
          this.listaDisciplinas = [];
          this.listaCursos = [];
        }
      },
      error: (err) => {
        this.snackbarService.showError('Erro ao identificar usuário.');
      },
    });
  }

  buscarDadosAuxiliar(usuario: any) {
    this.form.patchValue({
      usuarioId: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      registro: usuario.matricula,
      cargoId: usuario.cargoId,
    });
  }

  /* --- BUSCA DE DADOS DO PROFESSOR --- */
  buscarDadosProfessor(id: number) {
    this.professorService.getProfessorPorId(id).subscribe({
      next: (resposta) => {
        this.form.patchValue({
          usuarioId: resposta.usuarioId,
          nome: resposta.professorNome,
          email: resposta.professorEmail,
          registro: resposta.registroProfessor,
          cargoId: resposta.cargoId,
        });
      },
      error: (e) =>
        this.snackbarService.showError(e.message || 'Erro ao buscar detalhes do funcionario'),
    });
  }

  /* --- SALVAR --- */
  salvar() {
    if (this.form.invalid) {
      this.snackbarService.showError('Preencha todos os campos obrigatórios!');
      return;
    }

    const dadosForm = this.form.value;
    const id = this.usuarioId || dadosForm.usuarioId;
    const isAcademico = this.isProfessorOuCoordenador;

    let requestObservable: Observable<Professor | void>;

    if (isAcademico) {
      const idsDisciplinas = this.listaDisciplinas.map(d => d.disciplinaId);

      const payloadProfessor = {
        ...dadosForm,              
        disciplinas: idsDisciplinas 
      };

      requestObservable = this.professorService.editarProfessor(id, payloadProfessor);
    } else {
      requestObservable = this.usuarioService.atualizarUsuarioAdmin(id, dadosForm);
    }

    requestObservable.subscribe({
      next: () => {
        this.snackbarService.showSuccess('Dados atualizados com sucesso!');
        this.fechar.emit(true);
        this.modalService.dismissAll();
      },
      error: (err) => {
        console.error(err);
        this.snackbarService.showError('Erro ao atualizar.');
      },
    });
  }

  /* --- UTILITÁRIOS --- */
  fecharModal() {
    this.fechar.emit(false);
    this.modalService.dismissAll();
  }

  carregarDisciplinas() {
    if (this.usuarioId) {
      this.professorService.getDisciplinasDoProfessor(this.usuarioId).subscribe({
        next: (disciplinas) => (this.listaDisciplinas = disciplinas),
      });
    }
  }

  carregarCursos() {
    if (this.usuarioId) {
      this.professorService.getCursosDoProfessor(this.usuarioId).subscribe({
        next: (cursos) => (this.listaCursos = cursos),
        error: (err) => console.error(err),
      });
    }
  }

  isCargoAcademico(cargoId: number): boolean {
    return [1, 2, 3, 4, 5, 6].includes(cargoId);
  }

  get isProfessorOuCoordenador(): boolean {
    const id = this.form.get('cargoId')?.value;
    return this.isCargoAcademico(id);
  }

  /* --- MiniModal para disciplinas --- */

  abrirModalAdicionarDisciplina() {
    this.disciplinaService.getDisciplinas().subscribe({
      next: (todas) => {
        this.listaTodasDisciplinas = todas;

        this.modalService.open(this.modalAddDisciplina, { size: 'sm', centered: true });
      },
      error: () => this.snackbarService.showError('Erro ao carregar disciplinas disponíveis.'),
    });
  }

  salvarNovaDisciplina(modal: any) {
  if (this.disciplinaSelecionadaControl.invalid) {return;}

  const idSelecionado = Number(this.disciplinaSelecionadaControl.value);

  const disciplinaEncontrada = this.listaTodasDisciplinas.find(
    (d) => d.disciplinaId === idSelecionado 
  );

  if (disciplinaEncontrada) {
    const jaExiste = this.listaDisciplinas.some(
      (d) => d.disciplinaId === idSelecionado
    );

    if (!jaExiste) {
      this.listaDisciplinas.push(disciplinaEncontrada);
    } else {
      this.snackbarService.showError('Esta disciplina já foi adicionada.');
    }
  }

  this.disciplinaSelecionadaControl.reset();
  modal.close();
}

 removerDisciplina(idParaRemover: number) {
  this.listaDisciplinas = this.listaDisciplinas.filter(d => 
    d.disciplinaId !== idParaRemover
  );
}
}
