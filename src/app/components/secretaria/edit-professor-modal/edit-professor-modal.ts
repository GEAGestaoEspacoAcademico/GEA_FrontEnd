import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import type { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import ProfessorService from '../../../services/professor/professor.service';

@Component({
  selector: 'app-edit-professor-modal',
  standalone: false,
  templateUrl: './edit-professor-modal.html',
  styleUrl: './edit-professor-modal.css',
})
export class EditProfessorModal {
  form: FormGroup;

  @Input() professorId: number | null = null;

  @Output() fechar = new EventEmitter<boolean>();
  private fb = inject(FormBuilder);
  private professorService = inject(ProfessorService);
  private route = inject(ActivatedRoute);
  private snackbarService = inject(SnackBarService);


  constructor() {
    this.form = this.fb.group({
      professorId: [null],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      registroProfessor: ['', Validators.required],
      cargoId: [null, Validators.required]
    });
  }

  ngOnInit(): void {

    let idParaBuscar = this.professorId

    if (!idParaBuscar) {
      const idDaRota = this.route.snapshot.paramMap.get('id');
      if (idDaRota) {
        idParaBuscar = Number(idDaRota);
      }
    }

    if (idParaBuscar) {
      this.buscarDadosProfessor(idParaBuscar);
    }
  }

  buscarDadosProfessor(id: number) {
    this.professorService.getById(id).subscribe({
      next: (resposta) => {
        this.form.patchValue({
        professorId: resposta.id,
        nome: resposta.nome,
        email: resposta.email,
        registroProfessor: resposta.registro,
        cargoId: resposta.cargoId
      });
      }, error: e => this.snackbarService.showError(e.message || 'Erro ao buscar detalhes do funcionario')
    })
  }

  salvar() {
    if (this.form.invalid) {
      this.snackbarService.showError('Preencha todos os campos obrigatórios!');
      return;
    }

    const dadosParaEnviar = this.form.value;
    const id = this.professorId || dadosParaEnviar.professorId;

    this.professorService.editarProfessor(id, dadosParaEnviar).subscribe({
      next: () => {
        this.snackbarService.showSuccess('Professor atualizado com sucesso!');
        this.fechar.emit(true); 
      },
      error: (err) => {
        console.error(err);
        this.snackbarService.showError('Erro ao atualizar professor.');
      }
    });
  }

  fecharModal() {
    this.fechar.emit(false);
  }
  
}
