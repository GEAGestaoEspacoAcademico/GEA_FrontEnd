import type { OnInit } from '@angular/core';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import type { FormArray, FormGroup, ValidatorFn} from '@angular/forms';
import { FormBuilder, Validators} from '@angular/forms';
import { FormControl } from '@angular/forms';
import type { Field, Option } from './types';
import { map, startWith, type Observable } from 'rxjs';
import type { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-scheduling',
  standalone: false,
  templateUrl: './scheduling.html',
  styleUrl: './scheduling.css'
})
export class Scheduling implements OnInit {
  @Input() fields: Field[] = [];
  @Input() submitButtonText: string = "Salvar";
  @Input() cancelButtonText: string | undefined;
  @Output() formSubmit = new EventEmitter<Record<string, any>>();

  private fb = inject(FormBuilder);

  form: FormGroup;
  equipmentAddForm: FormGroup;

  softwareCtrl = new FormControl('');
  filteredOptions: Observable<Option[]> | undefined;
  filteredEquipments: Observable<Option[]> | undefined;

  
  constructor() {
    this.form = this.fb.group({});
    this.equipmentAddForm = this.fb.group({
      equipment: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

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

  private setupAutocomplete(control: FormControl, options: Option[] | undefined): Observable<Option[]> {
    return control.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value.toLowerCase() : value?.label.toLowerCase() || '';
        return options ? options.filter(option => option.label.toLowerCase().includes(filterValue)) : [];
      })
    );
  }
  getEquipmentControls(fieldName: string): any[] {
    const control = this.form.get(fieldName) as FormArray;
    return control ? control.controls : [];
    }

  addEquipment(field: Field): void {
    if (this.equipmentAddForm.invalid) { return; }

    const equipmentArray = this.form.get(field.name) as FormArray;
    const { equipment, quantity } = this.equipmentAddForm.value;

    equipmentArray.push(this.fb.group({
      id: [equipment.value],
      label: [equipment.label],
      quantity: [quantity]
    }));

    this.equipmentAddForm.reset({ equipment: null, quantity: 1 });
    (document.getElementById('equipment-input') as HTMLInputElement).value = '';
  }

  removeEquipment(field: Field, index: number): void {
    const equipmentArray = this.form.get(field.name) as FormArray;
    equipmentArray.removeAt(index);
  }

  displayEquipment(option: Option): string {
    return option && option.label ? option.label : '';
  }

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

  private _filter(value: string, options: Option[] | undefined): Option[] {
    if (!options) {return [];}
    const filterValue = value.toLowerCase();
    return options.filter(option => option.label.toLowerCase().includes(filterValue));
  }

  softwareSelected(event: MatAutocompleteSelectedEvent, field: Field): void {
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

  

  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      console.error("Formulário inválido!");
    }
  }
  getOptionLabel(options: Option[] | undefined, value: string): string {
    if (!options) {
      return '';
    }
    const option = options.find(opt => opt.value === value);
    return option ? option.label : '';
  }
  onChipRemoved(field: Field, valueToRemove: string): void {
    const control = this.form.get(field.name);
    if (control) {
      const currentValues: string[] = control.value || [];
      
      const newValues = currentValues.filter(value => value !== valueToRemove);

      control.setValue(newValues);
    }
  }
}
