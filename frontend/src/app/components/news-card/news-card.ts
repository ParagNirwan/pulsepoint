import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { NewsArticle } from '../../services/news.service';

@Component({
  selector: 'news-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './news-card.html',
  styleUrls: ['./news-card.css']
})
export class NewsCardComponent {
  @Input() article: NewsArticle | null = null

  liked = false
  saved = false

  openArticle() {
    if (this.article && this.article.url) {
      window.open(this.article.url, '_blank')
    }
  }
}

