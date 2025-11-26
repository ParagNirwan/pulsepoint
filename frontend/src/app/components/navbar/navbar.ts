import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'; // ✅ Correct import
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterModule], // ✅ Include it here
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'] // ✅ Correct property
})
export class Navbar {

  constructor(private authService: AuthService) { }

  logout() {
    console.log('Logout button clicked');
    this.authService.logout();
  }

  toggleTheme() {
    const root = document.documentElement;
    root.setAttribute('data-theme', root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }
}
