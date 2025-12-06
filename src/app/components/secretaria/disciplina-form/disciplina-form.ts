import type { OnInit } from '@angular/core';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CursoService } from '../../../services/curso/curso.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import type { Curso } from '../../../models/curso.model';
import { DisciplinaService } from '../../../services/disciplina/disciplina.service';
import type { CriarDisciplinaRequest } from '../../../types/disciplina.model';
import type { Disciplina } from '../../../models/disciplina.model';
import { SEMESTRES } from '../../../models/enums/semestres.enum';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-disciplina-form',
  standalone: false,
  templateUrl: './disciplina-form.html',
  styleUrl: './disciplina-form.css',
})
export class DisciplinaForm implements OnInit {
  private cursoService = inject(CursoService);
  private disciplinaService = inject(DisciplinaService);
  private snackbarService = inject(SnackBarService)

  @Input() title!: string;
  @Input() disciplina: Disciplina | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  cursos: Curso[] = [];
  public semestres = Object.values(SEMESTRES);

  isEditMode = false;

  disciplinaForm = new FormGroup({
    disciplinaNome: new FormControl('', Validators.required),
    cursoNome: new FormControl(0, Validators.required),
    disciplinaSemestre: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.isEditMode = this.title === 'Editar Disciplina';

    this.cursoService.getCursos().subscribe((data) => {
      this.cursos = data;

      if (this.disciplina && this.isEditMode) {
        this.disciplinaForm.patchValue({
          disciplinaNome: this.disciplina.disciplinaNome,
          cursoNome: Number(this.disciplina.cursoNome),
          disciplinaSemestre: this.disciplina.disciplinaSemestre,
        });
      }
    });
  }

  salvar() {
    if (this.disciplinaForm.invalid) {
      return;
    }

    const v = this.disciplinaForm.value;

    const payload: CriarDisciplinaRequest = {
      disciplinaNome: v.disciplinaNome as string,
      cursoId: v.cursoNome as number,
      disciplinaSemestre: v.disciplinaSemestre as string,
    };

    if (this.isEditMode && this.disciplina) {
      this.disciplinaService.editDisciplina(this.disciplina.disciplinaId, payload).subscribe({
          next: () => {
            this.saved.emit()
            this.snackbarService.showSuccess("Sucesso ao editar disciplina")
          },
          error: () => this.snackbarService.showError("Erro ao editar disciplina")
        }
      );
    } else {
      this.disciplinaService.criarDisciplina(payload).subscribe({
        next: () => {
          this.saved.emit();
          this.snackbarService.showSuccess("Sucesso ao criar uma disciplina")
        },
        error: () => this.snackbarService.showError("Erro ao editar uma disciplina")
      })
    }
  }

  cancelar() {
    this.closed.emit();
  }
}

/**Metodo de abertura do modal
 * openCursoModal(disciplina?: Disciplina) {
    const dialogRef = this.dialog.open(DisciplinaForm, {});

    const instance = dialogRef.componentInstance;

    instance.title = disciplina ? 'Editar Disciplina' : 'Nova Disciplina';
    instance.curso = disciplina ?? null;

    instance.saved.subscribe(() => {
      dialogRef.close();
    });

    instance.closed.subscribe(() => {
      dialogRef.close();
    });
  }
 */
