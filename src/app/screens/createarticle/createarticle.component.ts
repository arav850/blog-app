import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Article } from '../../models/Article.model';
import { ArticleService } from '../../services/articleService.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-createarticle',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './createarticle.component.html',
  styleUrls: ['./createarticle.component.scss'],
})
export class CreatearticleComponent implements OnInit {
  articleData: Article = new Article();
  drafts: Article[] = [];
  userdetails: any;

  constructor(
    public articleService: ArticleService,
    public router: Router,
    public cookie: CookieService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userdetails = JSON.parse(this.cookie.get('userDetails'));
    this.articleService.getDraftsByAuthor(this.userdetails.userId).subscribe(
      (drafts) => {
        this.drafts = drafts;
        console.log(drafts);
      },
      (error) => {
        console.error('Error retrieving drafts', error);
      }
    );
  }

  openDraft(draft: Article) {
    this.articleData = { ...draft };
    // console.log('Draft data after setting:', this.articleData);
    this.cdr.detectChanges();
  }

  saveDraft() {
    this.articleData.status = 'draft';
    this.articleData.authorId = this.userdetails.userId;
    console.log(this.articleData);
    this.articleService.saveArticle(this.articleData).subscribe(
      (response) => {
        console.log('Draft saved successfully', response);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error saving draft', error);
      }
    );
  }

  createArticle() {
    this.articleData.status = 'published';
    this.articleData.authorId = this.userdetails.userId;

    if (!this.articleData.id) {
      // Assign a new ID for the published article if it was not a draft
      this.articleData.id = String(this.generateRandomId());
    }
    this.articleService.createPost(this.articleData).subscribe({
      next: (article) => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error creating article:', err);
      },
    });
    console.log(this.articleData);
  }

  private generateRandomId(): number {
    return Math.floor(Math.random() * 1000);
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.articleData.category = selectElement.value;
  }

  onThumbnailSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.articleData.thumbnail = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.articleData.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
