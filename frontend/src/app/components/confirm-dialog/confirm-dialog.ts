import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Needed for ngModel

// Interface for the dynamic data
export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
  requirePassword?: boolean; // optional
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, FormsModule],
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.css']
})
export class ConfirmDialogComponent {
  password: string = ''; // For password input if required

  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) { }

  onCancel() {
    this.dialogRef.close(false); // User cancelled
  }

  onConfirm() {
    if (this.data.requirePassword) {
      // Pass password when required
      this.dialogRef.close({ password: this.password });
    } else {
      this.dialogRef.close(true); // Normal confirmation
    }
  }
}
