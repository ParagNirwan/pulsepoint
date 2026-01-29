import { Component, EventEmitter, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list'; // for mat-list and mat-list-item
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-sidebar',
  standalone: true,
  imports: [CommonModule, MatListModule],
  templateUrl: './settings-sidebar.html',
  styleUrls: ['./settings-sidebar.css']
})
export class SettingsSidebarComponent {

  categories = [
    { id: 'news', label: 'News Preferences' },
    { id: 'account', label: 'Account Settings' },
    { id: 'privacy', label: 'Privacy Settings' },
  ];

  @Output() categorySelected = new EventEmitter<string>();

  selectCategory(categoryId: string) {
    this.categorySelected.emit(categoryId);
  }
}
