import { DisciplinaService } from './../../../services/disciplina/disciplina.service';
import type { Disciplina } from './../../../models/disciplina.model';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import type { OnInit } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import type { FormArray, FormGroup } from '@angular/forms';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import { SecretariaService } from '../../../services/secretaria/secretaria.service';
import type { CriarSecretariaRequest } from '../../../types/secretaria.type';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';

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
  private readonly headerService = inject(HeaderTitleService)

  form!: FormGroup;
  modalDisciplinaAberto = false;

  disciplinasDisponiveis: Disciplina[] = [];
  disciplinaSelecionada: Disciplina | null = null;

  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.headerService.setTitle('Novo Funcionário')
    this.headerService.showBack()

    this.form = this.fb.group({
      nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.required],
      registro: ['', Validators.required],
      perfil: ['PROFESSOR', Validators.required],
      disciplinas: this.fb.array([]),
    });

    this.disciplinaService.getDisciplinas().subscribe({
      next: (data) => (this.disciplinasDisponiveis = data),
    });

    this.form.get('perfil')?.valueChanges.subscribe((perfil) => {
      const emailCtrl = this.form.get('email');

      if (!emailCtrl) {
        return;
      }

      if (perfil === 'PROFESSOR') {
        emailCtrl.setValidators([Validators.required, Validators.email]);
      } else {
        emailCtrl.setValidators([Validators.required]);
        this.disciplinas.clear();
      }

      emailCtrl.updateValueAndValidity();
    });
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

    const jaExiste = this.disciplinas.value.some(
      (disciplina: Disciplina) =>
        this.disciplinaSelecionada?.disciplinaId === disciplina.disciplinaId,
    );

    if (!jaExiste) {
      this.disciplinas.push(this.fb.control(this.disciplinaSelecionada));

      this.disciplinasDisponiveis = this.disciplinasDisponiveis.filter(
        (d) => d.disciplinaId !== this.disciplinaSelecionada?.disciplinaId,
      );

      this.disciplinaSelecionada = null;
      this.modalDisciplinaAberto = false;
    }
  }

  removeDisciplina(i: number): void {
    this.disciplinas.removeAt(i);
  }

  campoInvalido(nome: string): boolean {
    const c = this.form.get(nome);
    return !!(c && c.invalid && (c.touched || c.dirty));
  }

  onSave(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if (this.form.get('perfil')?.value === 'SECRETARIA') {
        const dados: CriarSecretariaRequest = {
          nome: this.form.get('nomeCompleto')?.value,
          email: this.form.get('email')?.value,
          matricula: this.form.get('registro')?.value,
        };

        this.secretariaService.cadastrar(dados).subscribe({
          next: () => {
            this.snackBar.showSuccess('Secretaria cadastrada com sucesso!');

            this.form.reset({ perfil: 'PROFESSOR' });
            this.saveForm.emit(this.form);
          },
          error: (err) => {
            this.snackBar.showError(err);
          },
        });
      }
    }
  }
}
