import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { TodoDataService } from '../../services/data.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete.dialog.html',
  styleUrls: ['./delete.dialog.scss']
})
export class DeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public todoDataService: TodoDataService) { }

  close(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.todoDataService.deleteTodo(this.data.id);
    this.dialogRef.close(true);
  }
}
