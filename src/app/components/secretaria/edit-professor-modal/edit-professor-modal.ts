import { Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import type { TemplateRef, OnInit } from '@angular/core';
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
import type {
  AtualizarProfessorRequest,
  BuscarCursosProfessorResponse,
} from '../../../types/professor.types';
import type { Cargo } from '../../../models/cargo.model';
import { CargoService } from '../../../services/cargo/cargo.service';
import type { AtualizarUsuarioAdminResquest } from '../../../types/usuario.type';
import type { AtulizarUsuarioFormulario } from '../../../types/util.types';

@Component({
  selector: 'app-edit-professor-modal',
  standalone: false,
  templateUrl: './edit-professor-modal.html',
  styleUrl: './edit-professor-modal.css',
})
export class EditProfessorModal implements OnInit {
  form: FormGroup;

  @Output() fechar = new EventEmitter<boolean>();

  private readonly fb = inject(FormBuilder);
  private readonly snackbarService = inject(SnackBarService);
  private readonly modalService = inject(NgbModal);
  private readonly professorService = inject(ProfessorService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly disciplinaService = inject(DisciplinaService);
  private readonly cargoService = inject(CargoService);

  private usuarioId: number | null = null;

  listaDisciplinas: Disciplina[] = [];
  listaCursos: BuscarCursosProfessorResponse[] = [];

  @ViewChild('EditProfessor') modalTemplate!: TemplateRef<EditProfessorModal>;

  listaTodasDisciplinas: Disciplina[] = []; // Todas as do sistema (para o select)
  disciplinaSelecionadaControl = new FormControl(null, Validators.required); // O controle do Select
  cargos: Cargo[] = [];

  @ViewChild('modalAddDisciplina') modalAddDisciplina!: TemplateRef<any>;

  /* --- CONFIGURAÇÃO INICIAL DO FORMULÁRIO --- */
  constructor() {
    this.form = this.fb.group({
      usuarioId: [null],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      registro: [{ value: null, disabled: true }],
      cargoId: [null],
    });

    //FEITO PELA IA
    this.form.get('cargoId')?.valueChanges.subscribe((cargoId) => {
      this.validarRegistroCondicional(cargoId);
      if (this.isCargoAcademico(cargoId)) {
        this.carregarDisciplinas();
      }
    });
  }

  /* --- INICIALIZAÇÃO E VERIFICAÇÃO DE ROTA --- */
  ngOnInit(): void {
    // if (this.usuarioId) {
    //   this.identificarEBuscarDados(this.usuarioId);
    // }
    this.resetarEstado();

    this.cargoService.getCargos().subscribe({
      next: (cargos) => (this.cargos = cargos),
    });
  }

  abrirInstaciaModal(id: number) {
    this.resetarEstado();

    this.modalService.open(this.modalTemplate, {
      backdrop: 'static',
      centered: true,
      size: 'lg',
    });

    this.identificarEBuscarDados(id);
  }

  //FEITO PELA IA
  private resetarEstado(): void {
    this.form.reset({
      usuarioId: null,
      nome: '',
      email: '',
      registro: null,
      cargoId: null,
    });

    this.usuarioId = null;
    this.listaDisciplinas = [];
    this.listaCursos = [];
    this.disciplinaSelecionadaControl.reset();
  }

  private validarRegistroCondicional(cargoId: number): void {
    const registroControl = this.form.get('registro');

    if (!registroControl) {
      return;
    }

    if (this.isCargoAcademico(cargoId)) {
      registroControl.setValidators(Validators.required);
      registroControl.enable();
    } else {
      registroControl.clearValidators();
      registroControl.disable();
    }
    registroControl.updateValueAndValidity();
  }

  identificarEBuscarDados(id: number) {
    this.usuarioId = id;

    this.usuarioService.buscarUsuarioPorId(id).subscribe({
      next: (usuario) => {
        this.buscarDadosAuxiliar(usuario);

        const cargo = usuario.cargoId;

        this.validarRegistroCondicional(cargo);

        if (this.isCargoAcademico(cargo)) {
          this.buscarDadosProfessor(id);
          this.carregarDisciplinas();
          this.carregarCursos();
        } else {
          this.listaDisciplinas = [];
          this.listaCursos = [];
        }
      },
      error: (err) => {
        console.error('Erro ao identificar usuário:', err);
        this.snackbarService.showError('Erro ao identificar usuário.');
      },
    });
  }

  buscarDadosAuxiliar(usuario: any) {
    this.form.patchValue({
      usuarioId: usuario.usuarioId || usuario.id,
      nome: usuario.usuarioNome || usuario.nome,
      email: usuario.usuarioEmail || usuario.email,
      registro: usuario.matricula || usuario.registro,
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
          registro: resposta.matricula,
          cargoId: resposta.cargoId,
        });
      },
      error: (e) => {
        console.error('Erro ao buscar detalhes do professor:', e);
        this.snackbarService.showError('Erro ao buscar detalhes do funcionario');
      },
    });
  }

  /* --- SALVAR --- */
  salvar() {
    this.form.get('registro')?.updateValueAndValidity();
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.snackbarService.showError('Preencha todos os campos obrigatórios!');
      return;
    }

    const dadosForm: AtulizarUsuarioFormulario = this.form.getRawValue();
    const id = this.usuarioId || dadosForm.usuarioId;
    const isAcademico = this.isProfessorOuCoordenador;

    let requestObservable: Observable<Professor | any>;

    if (isAcademico) {
      const idsDisciplinas = this.listaDisciplinas.map((d) => d.disciplinaId);

      const dadosParaApi: AtualizarProfessorRequest = {
        usuarioId: dadosForm.usuarioId,
        nome: dadosForm.nome,
        email: dadosForm.email,
        cargoId: dadosForm.cargoId,
        disciplinasIds: idsDisciplinas,
      };

      requestObservable = this.professorService.editarProfessor(id, dadosParaApi);
    } else {
      console.log("Atualizar usuario")
      const dadosParaApi: AtualizarUsuarioAdminResquest = {
        usuarioNome: dadosForm.nome,
        usuarioEmail: dadosForm.email,
        cargoId: dadosForm.cargoId,
      };

      requestObservable = this.usuarioService.atualizarUsuarioAdmin(id, dadosParaApi);
    }

    requestObservable.subscribe({
      next: () => {
        this.snackbarService.showSuccess('Dados atualizados com sucesso!');
        this.fechar.emit(true);
        this.modalService.dismissAll();
      },
      error: (err) => {
        console.error('Erro ao atualizar usuário:', err);
        this.snackbarService.showError('Erro ao atualizar. Verifique os dados e tente novamente.');
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
        error: (err) => console.error('Erro ao carregar disciplinas:', err),
      });
    }
  }

  carregarCursos() {
    if (this.usuarioId) {
      this.professorService.getCursosDoProfessor(this.usuarioId).subscribe({
        next: (cursos) => (this.listaCursos = cursos),
        error: (err) => console.error('Erro ao carregar cursos:', err),
      });
    }
  }

  isCargoAcademico(cargoId: number): boolean {
    return [3, 4].includes(cargoId);
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
    if (this.disciplinaSelecionadaControl.invalid) {
      this.snackbarService.showError('Selecione uma disciplina.');
      return;
    }

    const idSelecionado = Number(this.disciplinaSelecionadaControl.value);

    const disciplinaEncontrada = this.listaTodasDisciplinas.find(
      (d) => d.disciplinaId === idSelecionado,
    );

    if (disciplinaEncontrada) {
      const jaExiste = this.listaDisciplinas.some((d) => d.disciplinaId === idSelecionado);

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
    this.listaDisciplinas = this.listaDisciplinas.filter((d) => d.disciplinaId !== idParaRemover);
  }
}
