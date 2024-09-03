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
        this.drafts = drafts.filter((item) => item.status === 'draft');
        // console.log(drafts);
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
    // console.log(this.articleData);
    if (!this.articleData.id) {
      this.articleData.id = String(this.generateRandomId());
    }
    this.articleService.createPost(this.articleData).subscribe(
      (response) => {
        console.log('Draft saved successfully', response);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error saving draft', error);
      }
    );
  }

  updateDraft() {
    this.articleData.status = 'draft';
    this.articleData.authorId = this.userdetails.userId;
    console.log(this.articleData);
    // if (!this.articleData.id) {
    //   this.articleData.id = String(this.generateRandomId());
    // }
    this.articleService.updateArticle(this.articleData).subscribe(
      (response) => {
        console.log('Draft updated successfully', response);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error updating draft', error);
      }
    );
  }

  createArticle() {
    if (this.articleData.status === 'draft') {
      this.articleData.status = 'published';
      this.articleService.updateArticle(this.articleData).subscribe(
        (response) => {
          this.router.navigate(['/']);
          return;
        },
        (error) => {
          console.error('Error creating draft', error);
          return;
        }
      );
    } else if (this.articleData.status === '' && !this.articleData.id) {
      this.articleData.status = 'published';
      this.articleData.authorId = this.userdetails.userId;
      this.articleData.id = String(this.generateRandomId());

      this.articleService.createPost(this.articleData).subscribe({
        next: (article) => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error creating article:', err);
        },
      });
    }
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
