import { Component, Input, OnInit, SimpleChanges, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { DynamicFormControls } from '../model/model';
import { debounceTime, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit, OnChanges, OnDestroy {

  private destroy$ = new Subject();
  public dynamicForm: FormGroup = new FormGroup({});
  @Input() formDataObject!: Array<DynamicFormControls>;
  @Output() updatedForm: EventEmitter<any> = new EventEmitter<any>();
  validatorOrOpts: any;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.formDataObject.firstChange) {
      this.generateDynamicForm(this.formDataObject);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  generateDynamicForm(formDataObject: DynamicFormControls[]) {
    this.dynamicForm = new FormGroup({});
    for (const formData of formDataObject) {
      this.validatorOrOpts = [];
      this.formValidatorOrOpts(formData);

      const name = formData.title;
      const disabled = formData.options?.disabled ? true : false;
      let control;
      if (formData.type === 'select' && formData.options?.multi) {
        const value = [...formData.value];
        control = this.fb.control({value, disabled}, this.validatorOrOpts);
      } else {
        control = this.fb.control({value: formData.value, disabled}, this.validatorOrOpts);
      }
      this.dynamicForm.addControl(name, control);
    }

    this.dynamicForm.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(900)
    ).subscribe(res => {
      this.updatedForm.emit(res);
    })
  }

  formValidatorOrOpts(formData: DynamicFormControls) {
    if (!formData.validators) return;
    const entries = Object.entries(formData.validators)
    for (const [key, value] of entries) {
      switch (key) {
        case 'required':
          if (value) {
            this.validatorOrOpts.push(Validators.required);
          }
          break;
        case 'email':
          if (value) {
            this.validatorOrOpts.push(Validators.email);
          }
          break;
        case 'regExp':
          this.validatorOrOpts.push(Validators.pattern(value));
          break;
        case 'nullValidator':
          if (value) {
            this.validatorOrOpts.push(Validators.nullValidator);
          }
          break;
        default:
          break;
      }
    }
  }

  formError(formControlName: string) {
    return this.dynamicForm.controls[formControlName].invalid;
  }
  getInvalidMessage(formControlName: string) {
    if (this.dynamicForm.controls[formControlName].hasError('required')) {
      return 'You must enter a value';
    } else if (this.dynamicForm.controls[formControlName].hasError('email')) {
      return 'Not a valid email';
    } else {
      return 'Input is invalid';
    }
  }

}
