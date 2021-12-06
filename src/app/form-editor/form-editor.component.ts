import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { DynamicFormControls } from '../model/model';

@Component({
  selector: 'app-form-editor',
  templateUrl: './form-editor.component.html',
  styleUrls: ['./form-editor.component.scss']
})
export class FormEditorComponent implements OnInit {

  private destroy$ = new Subject();

  jsonParseError = true;
  editorOptions = { theme: 'vs-dark', language: 'json' };
  formDataControl = new FormControl();
  formDataString: string = `[
  {
    "id": 1,
    "title": "name",
    "label": "Name",
    "type": "input",
    "value": "John Doe",
    "options": {
      "inputType": "text"
    },
    "validators": {
      "required": true
    }
  },
  {
    "id": 2,
    "title": "email",
    "label": "Email",
    "type": "input",
    "value": "john@gmail.com",
    "options": {
      "inputType": "email"
    },
    "validators": {
      "required": true,
      "email": true
    }
  },
  {
    "id": 3,
    "title": "password",
    "label": "Password",
    "type": "input",
    "value": "",
    "options": {
      "inputType": "password"
    },
    "validators": {
      "required": true
    }
  },
  {
    "id": 4,
    "title": "dob",
    "label": "Date of Birth",
    "type": "date",
    "value": "1980-06-06T09:00:00.531Z"
  },
  {
    "id": 5,
    "title": "gender",
    "type": "radio",
    "label": "Gender",
    "value": "Male",
    "options": {
      "values": [
        "Male",
        "Female",
        "Non-binary"
      ]
    }
  },
  {
    "id": 6,
    "title": "role",
    "type": "select",
    "label": "Role",
    "value": "Admin",
    "options": {
      "multi": false,
      "values": [
        "Admin",
        "User"
      ]
    }
  },
  {
    "id": 7,
    "title": "active",
    "type": "binary",
    "label": "Active",
    "value": true,
    "options": {
      "binaryType": "check"
    }
  },
  {
    "id": 8,
    "title": "overview",
    "label": "Overview",
    "type": "textarea",
    "value": "John is a software engineer.",
    "options": {
      "disabled": true
    }
  }
]`;

  formDataObject!: Array<DynamicFormControls>;
  updatedFormData: any;

  constructor() { }

  ngOnInit(): void {
    this.formDataControl.setValue(this.formDataString);
    this.formDataControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(900),
      )
      .subscribe(str => {
        try {
          this.formDataObject = JSON.parse(str);
          this.jsonParseError = true;
        } catch (error) {
          console.warn('parse error !', error)
          this.jsonParseError = false;
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formResult(evt: any) {
    this.updatedFormData = evt;
  }

  get resultArray() {
    return this.updatedFormData ? Object.entries(this.updatedFormData) : [];
  }

}
