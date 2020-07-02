import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, Validators, FormControl } from '@angular/forms';

export interface InputDialogData {
  title: string;
  subject: string;
  type: InputDialogTypes;
  description: string;
}

export enum InputDialogTypes {
  Ticket = 'ticket',
  Add = 'add',
  Edit = 'edit'
}

@Component({
  selector: 'app-generic-input-dialog',
  templateUrl: './generic-input-dialog.component.html',
  styleUrls: ['./generic-input-dialog.component.css']
})
export class GenericInputDialogComponent implements OnInit {
  form: FormGroup;
  InputDialogTypes: typeof InputDialogTypes = InputDialogTypes;
  submitLoading: boolean;
  
  
  constructor(
    private dialogRef: MatDialogRef<GenericInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InputDialogData
  ) { }

  ngOnInit() {
    this.submitLoading = false;
    this.formInit();
  }

  formInit() {

    //if (this.data.type == InputDialogTypes.Edit) {
      this.form = new FormGroup({
        'subject': new FormControl(this.data.subject, Validators.required),
        'description': new FormControl(this.data.description, Validators.required)
      });
  }

  private isFormValid(): boolean {
    if (!this.form.valid) {
      
      return false;
    }

    return true;
  }

  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    this.submitLoading = true;

    this.data.subject = this.form.value['subject'];
    this.data.description = this.form.value['description'];

    this.dialogRef.close(this.data);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
