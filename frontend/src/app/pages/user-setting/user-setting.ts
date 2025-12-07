import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../components/confirm-dialog/confirm-dialog';
import { AuthService } from '../../auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    CommonModule,
    SettingsSidebarComponent,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './user-setting.html',
  styleUrls: ['./user-setting.css']
})
export class UserSettingsComponent {
  selectedCategory = 'news';

  constructor(private dialog: MatDialog, private authService: AuthService) { }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
  }

  openDeleteDialog() {
    const data: ConfirmDialogData = {
      title: 'Delete Account',
      message: 'Are you sure you want to delete your account?',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      requirePassword: false // password not needed anymore
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return console.log('Delete cancelled');

      this.authService.deleteAccount().subscribe({
        next: () => {

          alert('Your account has been deleted.');
          this.authService.logout(); // clears JWT + reloads
        },
        error: (err: HttpErrorResponse) => {

          alert('Failed to delete account. Please try again.');
        }
      });
    });
  }
}
