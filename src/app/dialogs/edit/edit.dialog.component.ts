import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { TodoDataService } from '../../services/data.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit.dialog.html',
  styleUrls: ['./edit.dialog.scss']
})
export class EditDialogComponent {

  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: TodoDataService) { }

  formControl = new FormControl('', [
    Validators.required
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dataService.updateTodo(this.data);
    this.dialogRef.close(true);
  }
}
