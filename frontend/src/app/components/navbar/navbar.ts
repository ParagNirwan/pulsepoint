import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  username$: Observable<string | null>;

  constructor(private authService: AuthService) {
    this.username$ = this.authService.username$;
  }

  logout() {
    this.authService.logout();
  }

  toggleTheme() {
    const root = document.documentElement;
    root.setAttribute(
      'data-theme',
      root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    );
  }
}
