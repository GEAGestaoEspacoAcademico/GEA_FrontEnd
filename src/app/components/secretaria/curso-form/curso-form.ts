import type { OnInit } from '@angular/core';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CoordenadorService } from '../../../services/coordenador/coordenador.service';
import type { Coordenador } from '../../../models/coordenador.model';
import type { Curso } from '../../../models/curso.model';
import { CursoService } from '../../../services/curso/curso.service';
import type { CriarCursoRequest } from '../../../types/curso';

@Component({
  selector: 'app-curso-form',
  standalone: false,
  templateUrl: './curso-form.html',
  styleUrl: './curso-form.css',
})
export class CursoForm implements OnInit {
  private cursoService = inject(CursoService);
  private coordenadorService = inject(CoordenadorService);

  @Input() title!: string;
  @Input() curso: Curso | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  coordenadores: Coordenador[] = [];

  isEditMode = false;

  cursoForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    sigla: new FormControl('', Validators.required),
    coordenadorId: new FormControl(0, Validators.required),
  });

  ngOnInit(): void {
    this.isEditMode = this.title === 'Editar Curso';

    this.coordenadorService.getCoordenadores().subscribe((data) => {
      this.coordenadores = data;
    });

    if (this.curso && this.isEditMode) {
      this.cursoForm.patchValue({
        nome: this.curso.cursoNome,
        sigla: this.curso.cursoSigla,
        coordenadorId: Number(this.curso.coordenadorId),
      });
    }
  }

  salvar() {
    if (this.cursoForm.invalid) {
      return;
    }

    const v = this.cursoForm.value;

    const payload: CriarCursoRequest = {
      cursoNome: v.nome as string,
      cursoSigla: v.sigla as string,
      coordenadorId: Number(v.coordenadorId),
    };

    if (this.isEditMode && this.curso) {
      this.cursoService.editCurso(this.curso.cursoId, payload).subscribe(() => this.saved.emit());
    } else {
      this.cursoService.criarCurso(payload).subscribe(() => this.saved.emit());
    }
  }

  cancelar() {
    this.closed.emit();
  }
}

/**Metodo de abertura do modal
 * openCursoModal(curso?: Curso) {
    const dialogRef = this.dialog.open(CursoForm, {});

    const instance = dialogRef.componentInstance;

    instance.title = curso ? 'Editar Curso' : 'Novo Curso';
    instance.curso = curso ?? null;

    instance.saved.subscribe(() => {
      dialogRef.close();
    });

    instance.closed.subscribe(() => {
      dialogRef.close();
    });
  }
 */
