import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { NewsService, NewsArticle } from '../../services/news.service';
import { NewsCardComponent } from '../news-card/news-card';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  badge?: boolean;
  action?: () => void;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    NewsCardComponent
  ],
  templateUrl: './sidenav.html',
  styleUrls: ['./sidenav.css']
})
export class SidenavComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  articles$: Observable<NewsArticle[]>;
  collapsed = false;
  isSmallScreen = false;
  sidenavOpened = true;

  menuItems: MenuItem[] = [
    { label: 'News Feed', icon: 'article', route: '/feed' },
    { label: 'Bookmarks', icon: 'bookmark', route: '/bookmarks' },
    { label: 'Liked News', icon: 'thumb_up', route: '/liked' },
    { label: 'Settings', icon: 'settings', route: '/user-settings' },
    { label: 'Log Out', icon: 'power_settings_new', action: () => this.logout() }
  ];

  constructor(
    private newsService: NewsService,
    private breakpoint: BreakpointObserver,
    private authService: AuthService

  ) {

    this.articles$ = this.newsService.fetchTopHeadlines('us', 10).pipe(
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.breakpoint.observe([Breakpoints.Handset, Breakpoints.Tablet]).subscribe(result => {
      this.isSmallScreen = result.matches;
      if (this.isSmallScreen) {
        this.sidenavOpened = false;
        this.collapsed = false; // ensure we do not use collapsed mode on small screen
      } else {
        this.sidenavOpened = true;
      }
    });
  }

  // toggle acts differently on small screen
  toggleCollapsed(): void {
    if (this.isSmallScreen && this.sidenav) {
      // on small screen use this button to open or close the overlay drawer
      this.sidenav.toggle();
    } else {
      this.collapsed = !this.collapsed;
    }
  }

  openSidenav(): void {
    if (this.sidenav) {
      this.sidenav.open();
    }
  }

  // called when a nav item is clicked
  onNavItemClick(label?: string): void {
    if (this.isSmallScreen && this.sidenav) {
      this.sidenav.close();
    }
    if (label == "Log Out") {
      this.logout();
    }
  }

  trackByLabel(index: number, item: MenuItem): string {
    return item.label;
  }

  logout() {
    console.log('Logging out user from SidenavComponent');
    this.authService.logout();
  }
}
