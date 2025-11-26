// src/app/pages/feed/feed.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { SidenavComponent } from '../../components/sidenav/sidenav';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, SidenavComponent],
  templateUrl: './feed.html',
  styleUrls: ['./feed.css']
})
export class Feed implements OnInit {
  username: string | null = null;

  constructor(private authService: AuthService) { }

  async ngOnInit() {
    this.username = await this.authService.getUsername();
  }
}
