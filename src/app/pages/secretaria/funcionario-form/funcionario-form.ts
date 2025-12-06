import { DisciplinaService } from './../../../services/disciplina/disciplina.service';
import type { Disciplina } from './../../../models/disciplina.model';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import type { OnInit } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import type { FormArray, FormGroup, AbstractControl } from '@angular/forms';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import { SecretariaService } from '../../../services/secretaria/secretaria.service';
import type { CriarSecretariaRequest } from '../../../types/secretaria.type';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';
import { AuxiliarDocenteService } from '../../../services/auxiliar-docente/auxiliar-docente.service';

import { of, type Observable } from 'rxjs';
import type { CriarAuxiliarDocenteRequest } from '../../../models/auxiliarDocente.model';
import ProfessorService from '../../../services/professor/professor.service';



@Component({
  selector: 'app-funcionario-form',
  standalone: false,
  templateUrl: './funcionario-form.html',
  styleUrls: ['./funcionario-form.css'],
})
export class FuncionarioForm implements OnInit {

  @Output() saveForm = new EventEmitter<FormGroup>();
  @Output() cancelForm = new EventEmitter<void>();

  private readonly disciplinaService: DisciplinaService = inject(DisciplinaService);
  private readonly snackBar: SnackBarService = inject(SnackBarService);
  private readonly secretariaService: SecretariaService = inject(SecretariaService);
  private readonly auxiliarDocenteService: AuxiliarDocenteService = inject(AuxiliarDocenteService);
  private readonly professorService: ProfessorService = inject(ProfessorService);
  private readonly headerService = inject(HeaderTitleService);
  private readonly fb = inject(FormBuilder);

  form!: FormGroup;
  modalDisciplinaAberto = false;

  disciplinasDisponiveis: Disciplina[] = [];
  disciplinaSelecionada: Disciplina | null = null;

  public readonly PERFIL_PROFESSOR = 'PROFESSOR';
  public readonly PERFIL_SECRETARIA = 'SECRETARIA';
  public readonly PERFIL_AUXILIAR_DOCENTE = 'AUXILIAR_DOCENTE';


  ngOnInit(): void {
    this.headerService.setTitle('Novo Funcionário')
    this.headerService.showBack()

    this.form = this.fb.group({
      nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      perfil: [this.PERFIL_PROFESSOR, Validators.required],
    });
    this.atualizarEstruturaFormulario(this.form.get('perfil')?.value as string);

    this.form.get('perfil')?.valueChanges.subscribe((perfil) => {
      if (perfil) {
        this.atualizarEstruturaFormulario(perfil);
      }
    });

    this.disciplinaService.getDisciplinas().subscribe({
      next: (data) => (this.disciplinasDisponiveis = data),
    });
  }


  private atualizarEstruturaFormulario(perfil: string): void {
    const formControls = this.form.controls;
    const isProfessor = perfil === this.PERFIL_PROFESSOR;
    const isSecretaria = perfil === this.PERFIL_SECRETARIA;
    const isAuxiliar = perfil === this.PERFIL_AUXILIAR_DOCENTE;

    if (formControls['registro']) {
      this.form.removeControl('registro');
    }

    if (formControls['area']) {
      this.form.removeControl('area');
    }

    if (formControls['disciplinas']) {
      if (!isProfessor) {
        (this.form.get('disciplinas') as FormArray).clear();
        this.form.removeControl('disciplinas');
      }
    }

    if (isAuxiliar) {
      this.form.addControl(
        'area',
        this.fb.control('', Validators.required),
      );

    } else if (isProfessor || isSecretaria) {
      this.form.addControl(
        'registro',
        this.fb.control('', Validators.required),
      );

      if (isProfessor) {
        if (!formControls['disciplinas']) {
          this.form.addControl(
            'disciplinas',
            this.fb.array([]),
          );
        }
      }

      if (isProfessor || isAuxiliar) {
        this.form.addControl(
          'login',
          this.fb.control('', Validators.required),
        );

        this.form.addControl(
          'senha',
          this.fb.control('', Validators.required),
        );
      }
    }

    const emailCtrl = this.form.get('email') as AbstractControl;
    emailCtrl.setValidators([Validators.required, Validators.email]);

    this.form.updateValueAndValidity();
  }

  get disciplinas(): FormArray {
    return this.form.get('disciplinas') as FormArray;
  }

  abrirModalDisciplina(): void {
    this.modalDisciplinaAberto = true;
  }

  confirmarDisciplina(): void {
    if (this.disciplinaSelecionada === null) {
      this.snackBar.showError('Selecione uma disciplina');
      return;
    }

    const disciplinasArray = this.form.get('disciplinas') as FormArray;
    if (!disciplinasArray) {
      this.snackBar.showError('O perfil atual não suporta disciplinas.');
      return;
    }


    const jaExiste = disciplinasArray.value.some(
      (disciplina: Disciplina) =>
        this.disciplinaSelecionada?.disciplinaId === disciplina.disciplinaId,
    );

    if (!jaExiste) {
      disciplinasArray.push(this.fb.control(this.disciplinaSelecionada));

      this.disciplinasDisponiveis = this.disciplinasDisponiveis.filter(
        (d) => d.disciplinaId !== this.disciplinaSelecionada?.disciplinaId,
      );

      this.disciplinaSelecionada = null;
      this.modalDisciplinaAberto = false;
    } else {
      this.snackBar.showError('Disciplina já adicionada.');
    }
  }

  removeDisciplina(i: number): void {
    const disciplinaRemovida = this.disciplinas.value[i];

    if (disciplinaRemovida) {
      this.disciplinasDisponiveis.push(disciplinaRemovida);
    }

    this.disciplinas.removeAt(i);
  }

  campoInvalido(nome: string): boolean {
    const c = this.form.get(nome);
    return !!(c && c.invalid && (c.touched || c.dirty));
  }

  onSave(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      this.snackBar.showError('Preencha todos os campos obrigatórios.');
      return;
    }

    const perfil = this.form.get('perfil')?.value;
    const { login, nomeCompleto, email, registro, area, senha } = this.form.value;

    let observableSalvar: Observable<any>;
    let payload: any;
    let mensagemSucesso: string;

    switch (perfil) {
      case this.PERFIL_PROFESSOR:
        {
          const disciplinasPayload = this.disciplinas.value.map((d: Disciplina) => ({
            disciplinaId: d.disciplinaId,
            disciplinaNome: d.disciplinaNome,
          }));

          debugger;

          payload = {
            login: login,
            nome: nomeCompleto,
            email: email,
            registro: registro,
            disciplinas: disciplinasPayload,
            senha: senha
          };

          debugger;
          observableSalvar = this.professorService.criarProfessor(payload);
          mensagemSucesso = 'Professor cadastrado com sucesso!';
          break;
        }

      case this.PERFIL_SECRETARIA:
        payload = {
          nome: nomeCompleto,
          email: email,
          matricula: registro,
        } as CriarSecretariaRequest;

        observableSalvar = this.secretariaService.cadastrar(payload);
        mensagemSucesso = 'Secretaria cadastrada com sucesso!';
        break;

      case this.PERFIL_AUXILIAR_DOCENTE:
        payload = {
          login: login,
          nome: nomeCompleto,
          email: email,
          senha: senha,
          area: area,
        } as CriarAuxiliarDocenteRequest;

        observableSalvar = this.auxiliarDocenteService.criar(payload);
        mensagemSucesso = 'Auxiliar Docente cadastrado com sucesso!';
        break;

      default:
        this.snackBar.showError('Perfil de funcionário não reconhecido.');
        return;
    }

    observableSalvar.subscribe({
      next: () => {
        this.snackBar.showSuccess(mensagemSucesso);

        this.form.reset({ perfil: perfil });
        this.atualizarEstruturaFormulario(perfil);
        this.saveForm.emit(this.form);
      },
      error: (err) => {
        const erroMensagem = err.error?.message || err.message || 'Erro desconhecido ao cadastrar.';
        this.snackBar.showError(erroMensagem);
      },
    });
  }
}