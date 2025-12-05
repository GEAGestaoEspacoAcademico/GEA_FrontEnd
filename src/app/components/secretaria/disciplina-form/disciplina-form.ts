import type { OnInit } from '@angular/core';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CursoService } from '../../../services/curso/curso.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import type { Curso } from '../../../models/curso.model';
import { DisciplinaService } from '../../../services/disciplina/disciplina.service';
import type { CriarDisciplinaRequest } from '../../../types/disciplina.model';
import type { Disciplina } from '../../../models/disciplina.model';
import { SEMESTRES } from '../../../models/enums/semestres.enum';

@Component({
  selector: 'app-disciplina-form',
  standalone: false,
  templateUrl: './disciplina-form.html',
  styleUrl: './disciplina-form.css',
})
export class DisciplinaForm implements OnInit {
  private cursoService = inject(CursoService);
  private disciplinaService = inject(DisciplinaService);

  @Input() title!: string;
  @Input() disciplina: Disciplina | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  cursos: Curso[] = [];
  public semestres = Object.values(SEMESTRES);

  isEditMode = false;

  disciplinaForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    cursoNome: new FormControl(0, Validators.required),
    semestre: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.isEditMode = this.title === 'Editar Disciplina';

    this.cursoService.getCursos().subscribe((data) => {
      this.cursos = data;

      if (this.disciplina && this.isEditMode) {
        this.disciplinaForm.patchValue({
          nome: this.disciplina.disciplinaNome,
          cursoNome: Number(this.disciplina.cursoNome),
          semestre: this.disciplina.disciplinaSemestre,
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
      disciplinaNome: v.nome as string,
      cursoId: v.cursoNome as number,
      disciplinaSemestre: v.semestre as string,
    };

    if (this.isEditMode && this.disciplina) {
      this.disciplinaService
        .editDisciplina(this.disciplina.disciplinaId, payload)
        .subscribe(() => this.saved.emit());
    } else {
      this.disciplinaService.criarDisciplina(payload).subscribe(() => this.saved.emit());
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
