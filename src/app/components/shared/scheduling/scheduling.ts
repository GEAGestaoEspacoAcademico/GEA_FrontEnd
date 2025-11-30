import type { OnInit } from '@angular/core';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import type { FormArray, FormGroup, ValidatorFn } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import type { Field, Option } from './types';
import { map, startWith, type Observable } from 'rxjs';
import type { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

/**
 * Componente de formulário dinâmico e reutilizável.
 * Gera um FormGroup complexo com base na configuração [fields] recebida.
 * Gerencia internamente FormArrays (para 'equipment-select') e
 * autocompletes (para 'multi-select' e 'equipment-select').
 * @usage
 * <app-scheduling
 * [fields]="configuracaoDosCampos"
 * submitButtonText="Agendar"
 * [cancelButtonText]="'Voltar'"
 * (formSubmit)="onAgendamentoSubmit($event)"
 * ></app-scheduling>
 */
@Component({
  selector: 'app-scheduling',
  standalone: false,
  templateUrl: './scheduling.html',
  styleUrl: './scheduling.css'
})
export class Scheduling implements OnInit {
  /** Referência injetada ao FormBuilder para criação de formulários. */
  private fb = inject(FormBuilder);

  /** A configuração (array de Field) que define a estrutura do formulário. */
  @Input() fields: Field[] = [];

  /** O texto a ser exibido no botão principal de submit. */
  @Input() submitButtonText: string = "Salvar";

  /** (Opcional) Texto do botão de cancelamento. Se indefinido, o botão não é exibido. */
  @Input() cancelButtonText: string | undefined;

  /** Emitido quando o formulário é válido e submetido. Emite o valor completo (form.value). */
  @Output() formSubmit = new EventEmitter<Record<string, any>>();

  /** O FormGroup principal, construído dinamicamente no ngOnInit. */
  public form: FormGroup;

  /** FormGroup auxiliar para o mini-formulário de "Adicionar Equipamento". */
  public equipmentAddForm: FormGroup;

  /** FormControl para o campo de input de autocomplete de "Softwares" (multi-select). */
  public softwareCtrl = new FormControl('');

  /** Observable (stream) de opções filtradas para o autocomplete de "Softwares". */
  public filteredOptions: Observable<Option[]> | undefined;

  /** Observable (stream) de opções filtradas para o autocomplete de "Equipamentos". */
  public filteredEquipments: Observable<Option[]> | undefined;

  /**
   * Inicializa os shells vazios do FormGroup para evitar
   * erros de template antes do ngOnInit.
   */
  constructor() {
    this.form = this.fb.group({});
    this.equipmentAddForm = this.fb.group({
      equipment: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  /**
   * Gancho de ciclo de vida. Constrói o FormGroup principal com base no @Input() fields.
   * Configura os validadores e inicializa os FormArrays e Observables de autocomplete.
   */
  ngOnInit(): void {
    const controls: Record<string, any> = {};
    this.fields.forEach(field => {
      const validators = this.buildValidators(field.validators);

      if (field.type === 'equipment-select') {
        controls[field.name] = this.fb.array([]);
      } else {
        const initialValue = field.type === 'multi-select' ? (field.defaultValue ?? []) : (field.defaultValue ?? '');
        controls[field.name] = new FormControl(initialValue, validators);
      }
    });
    this.form = this.fb.group(controls);

    const softwareField = this.fields.find(f => f.type === 'multi-select');
    this.filteredOptions = this.setupAutocomplete(this.softwareCtrl, softwareField?.options);

    const equipmentField = this.fields.find(f => f.type === 'equipment-select');
    this.filteredEquipments = this.setupAutocomplete(this.equipmentAddForm.get('equipment') as FormControl, equipmentField?.options);
  }

  /**
   * (Privado) Configura um pipe RxJS para um FormControl de autocomplete.
   * @param control O FormControl do campo de input.
   * @param options A lista completa de opções para filtrar.
   * @returns Um Observable<Option[]> com as opções filtradas.
   */
  private setupAutocomplete(control: FormControl, options: Option[] | undefined): Observable<Option[]> {
    return control.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value.toLowerCase() : value?.label.toLowerCase() || '';
        return options ? options.filter(option => option.label.toLowerCase().includes(filterValue)) : [];
      })
    );
  }

  /**
   * (Público - Template) Retorna os controles de um FormArray pelo nome do campo.
   * Usado no template para iterar sobre os equipamentos adicionados.
   * @param fieldName O nome do campo (field.name) que é um FormArray.
   * @returns Um array de AbstractControl (os FormGroups de equipamento).
   */
  public getEquipmentControls(fieldName: string): any[] {
    const control = this.form.get(fieldName) as FormArray;
    return control ? control.controls : [];
  }

  /**
   * (Público - Template) Adiciona um item de equipamento ao FormArray.
   * Pega os valores do 'equipmentAddForm' e os insere no 'form' principal.
   * @param field O objeto Field correspondente ao 'equipment-select'.
   */
  public addEquipment(field: Field): void {
    if (this.equipmentAddForm.invalid) { return; }

    const equipmentArray = this.form.get(field.name) as FormArray;
    const { equipment, quantity } = this.equipmentAddForm.value;

    equipmentArray.push(this.fb.group({
      id: [equipment.value],
      label: [equipment.label],
      quantity: [quantity]
    }));

    this.equipmentAddForm.reset({ equipment: null, quantity: 1 });
    const equipmentInput = document.getElementById('equipment-input') as HTMLInputElement;
    if (equipmentInput) {
      equipmentInput.value = '';
    }
  }

  /**
   * (Público - Template) Remove um item de equipamento de um FormArray pelo índice.
   * @param field O objeto Field (para encontrar o FormArray pelo nome).
   * @param index O índice do item a ser removido.
   */
  public removeEquipment(field: Field, index: number): void {
    const equipmentArray = this.form.get(field.name) as FormArray;
    equipmentArray.removeAt(index);
  }

  /**
   * (Público - Template) Usado pelo [displayWith] do MatAutocomplete.
   * Garante que o input mostre o 'label' da Opção, e não o objeto [object Object].
   * @param option O objeto Option.
   * @returns O 'label' da opção ou uma string vazia.
   */
  public displayEquipment(option: Option): string {
    return option && option.label ? option.label : '';
  }

  /**
   * (Privado) Constrói um array de ValidatorFn com base na configuração de um Field.
   * @param validatorsConfig O objeto de configuração de validadores (required, minLength, etc.).
   * @returns Um array de ValidatorFn para o FormControl.
   */
  private buildValidators(validatorsConfig: Field['validators']): ValidatorFn[] {
    if (!validatorsConfig) {
      return [];
    }
    const validators: ValidatorFn[] = [];
    if (validatorsConfig.required) {
      validators.push(Validators.required);
    }
    if (validatorsConfig.minLength) {
      validators.push(Validators.minLength(validatorsConfig.minLength));
    }
    if (validatorsConfig.maxLength) {
      validators.push(Validators.maxLength(validatorsConfig.maxLength));
    }
    if (validatorsConfig.pattern) {
      validators.push(Validators.pattern(validatorsConfig.pattern));
    }
    return validators;
  }

  /**
   * (Público - Template) Chamado pelo (optionSelected) do autocomplete de software.
   * Adiciona o valor selecionado ao array de valores do FormControl (multi-select).
   * @param event O evento MatAutocompleteSelectedEvent.
   * @param field O Field correspondente ao 'multi-select'.
   */
  public softwareSelected(event: MatAutocompleteSelectedEvent, field: Field): void {
    const control = this.form.get(field.name);
    if (control) {
      const currentValues: string[] = control.value || [];
      const selectedValue = event.option.value;

      if (!currentValues.includes(selectedValue)) {
        control.setValue([...currentValues, selectedValue]);
      }

      this.softwareCtrl.setValue('');
      document.getElementById('software-input')?.blur();
    }
  }

  /**
   * (Público - Template) Manipulador do evento (ngSubmit) do formulário.
   * Se o 'form' for válido, emite o evento 'formSubmit'.
   * Caso contrário, loga um erro no console.
   */
  public onSubmit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      console.error("Formulário inválido!", this.form.value);
    }
  }

  /**
   * (Público - Template) Busca o 'label' de uma opção com base em seu 'value'.
   * Usado para exibir os 'chips' do multi-select de software.
   * @param options A lista completa de opções do campo.
   * @param value O valor (ID) da opção.
   * @returns O 'label' correspondente ou uma string vazia.
   */
  public getOptionLabel(options: Option[] | undefined, value: string): string {
    if (!options) {
      return '';
    }
    const option = options.find(opt => opt.value === value);
    return option ? option.label : '';
  }

  /**
   * (Público - Template) Chamado quando um 'chip' de software é removido.
   * Remove o valor correspondente do array de valores do FormControl.
   * @param field O Field correspondente.
   * @param valueToRemove O valor a ser removido.
   */
  public onChipRemoved(field: Field, valueToRemove: string): void {
    const control = this.form.get(field.name);
    if (control) {
      const currentValues: string[] = control.value || [];
      const newValues = currentValues.filter(value => value !== valueToRemove);
      control.setValue(newValues);
    }
  }
}