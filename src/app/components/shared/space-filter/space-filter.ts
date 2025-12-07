import type { OnInit } from '@angular/core';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import type { TipoSala } from '../../../models/tipoSala.mode';
import type { FormArray, FormGroup } from '@angular/forms';
import { FormBuilder, FormControl } from '@angular/forms';
import { TipoSalaService } from '../../../services/tipo-sala/tipo-sala.service';
import { PisoService } from '../../../services/piso/piso.service';
import type { SpaceFilterType } from '../../../types/space-filter.type';
import type { Piso } from '../../../models/piso';

@Component({
  selector: 'app-space-filter',
  standalone: false,
  templateUrl: './space-filter.html',
  styleUrl: './space-filter.css',
})
export class SpaceFilter implements OnInit {
  private tipoSalaService = inject(TipoSalaService);
  private pisoService = inject(PisoService);
  private fb = inject(FormBuilder);

  @Output() filterChange = new EventEmitter<SpaceFilterType>();

  tiposSala: TipoSala[] = [];
  pisos: Piso[] = [];

  readonly OPCOES_DISPONIBILIDADE = [
    { label: 'Disponível', value: 'DISPONIVEL' },
    { label: 'Indisponível', value: 'INDISPONIVEL' },
  ];

  filterForm: FormGroup = this.fb.group({
    tipos: this.fb.array<FormControl<boolean>>([]),
    pisos: this.fb.array<FormControl<boolean>>([]),
    status: this.fb.array<FormControl<boolean>>([]),
  });

  get tiposArray(): FormArray<FormControl<boolean>> {
    return this.filterForm.get('tipos') as FormArray<FormControl<boolean>>;
  }

  get pisosArray(): FormArray<FormControl<boolean>> {
    return this.filterForm.get('pisos') as FormArray<FormControl<boolean>>;
  }

  get statusArray(): FormArray<FormControl<boolean>> {
    return this.filterForm.get('status') as FormArray<FormControl<boolean>>;
  }

  ngOnInit(): void {
    this.carregarTipos();
    this.carregarPisos();
    this.carregarDisponibilidade();
  }

  private carregarTipos(): void {
    this.tipoSalaService.getTiposSala().subscribe((tipos) => {
      this.tiposSala = tipos;
      this.tiposArray.clear();

      tipos.forEach(() =>
        this.tiposArray.push(new FormControl<boolean>(false, { nonNullable: true })),
      );
    });
  }

  private carregarPisos(): void {
    this.pisoService.listar().subscribe((pisos) => {
      this.pisos = pisos;
      this.pisosArray.clear();

      pisos.forEach(() =>
        this.pisosArray.push(new FormControl<boolean>(false, { nonNullable: true })),
      );
    });
  }

  private carregarDisponibilidade(): void {
    this.statusArray.clear();

    this.OPCOES_DISPONIBILIDADE.forEach(() =>
      this.statusArray.push(new FormControl<boolean>(false, { nonNullable: true })),
    );
  }

  aplicar(): void {
    const tiposSelecionados = this.tiposArray.value
      .map((v: boolean, idx: number) => (v ? this.tiposSala[idx].tipoSalaId : null))
      .filter((x): x is number => x !== null);

    const pisosSelecionados = this.pisosArray.value
      .map((v: boolean, idx: number) => (v ? this.pisos[idx].pisoNome : null))
      .filter((x): x is string => x !== null);

    const statusSelecionado = this.statusArray.value
      .map((v: boolean, idx: number) => (v ? this.OPCOES_DISPONIBILIDADE[idx].value : null))
      .filter((x): x is string => x !== null);

    const result: SpaceFilterType = {
      tipos: tiposSelecionados,
      pisos: pisosSelecionados,
      status: statusSelecionado,
    };

    this.filterChange.emit(result);
  }

  limpar(): void {
    this.filterForm.reset();

    this.filterChange.emit({
      pisos: [],
      status: [],
      tipos: [],
    });
  }
}
