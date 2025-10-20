
export type FieldType = 'text' | 'date' | 'select' | 'multi-select' | 'equipment-select';

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: Option[];
  defaultValue?: string | number;
  validators?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string; // para regex
    errorMessages?: Record<string, string>;
  }
  isloading?: boolean  
}

export interface Option{
  value: string | number,
  label: string
}