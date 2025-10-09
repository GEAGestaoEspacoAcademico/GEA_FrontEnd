
export type FieldType = 'text' | 'date' | 'select' | 'multi-select';

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: Option[];
  defaultValue?: any;
}

export interface Option{
  value: string,
  label: string
}