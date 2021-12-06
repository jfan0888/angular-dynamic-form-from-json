export interface FormOptions {
  disabled?: boolean;
  values?: any[];
  inputType?: string | 'text' | 'number' | 'email' | 'password' | 'tel' | 'url';
  binaryType?: string | 'check' | 'toggle';
  multi?: boolean;
}
export interface FormValidators {
  required?: boolean;
  email?: boolean;
  regExp?: string;
  nullValidator?: boolean;
}

export interface DynamicFormControls {
  id: number;
  title: string;
  type: string;
  label?: string;
  value?: any;
  options?: FormOptions;
  validators: FormValidators;
}

