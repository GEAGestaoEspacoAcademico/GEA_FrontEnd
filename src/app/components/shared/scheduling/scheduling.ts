import type { OnInit } from '@angular/core';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import type { FormGroup, ValidatorFn} from '@angular/forms';
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
  softwareCtrl = new FormControl('');
  filteredOptions: Observable<Option[]> | undefined;
  
  constructor() {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    const controls: Record<string, FormControl>  = {};
    this.fields.forEach(field => {
      const validators = this.buildValidators(field.validators);

      const initialValue = field.type === 'multi-select'
        ? (field.defaultValue ?? [])
        : (field.defaultValue ?? '');
      controls[field.name] = new FormControl(initialValue);

      controls[field.name] = new FormControl(initialValue, validators);
    });
    this.form = this.fb.group(controls);
    const softwareField = this.fields.find(f => f.type === 'multi-select');
    const allSoftwares = softwareField ? softwareField.options : [];



    this.filteredOptions = this.softwareCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', allSoftwares))
    );
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
