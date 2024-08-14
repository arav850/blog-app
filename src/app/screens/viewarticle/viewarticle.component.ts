import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArticleService } from '../../services/articleService.service';
import { ActivatedRoute } from '@angular/router';
import { Article } from '../../models/Article.model';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentsSidebarComponent } from '../../comments-sidebar/comments-sidebar.component';

@Component({
  selector: 'app-viewarticle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CommentsSidebarComponent],
  templateUrl: './viewarticle.component.html',
  styleUrl: './viewarticle.component.scss',
  schemas: [NO_ERRORS_SCHEMA],
})
export class ViewarticleComponent {
  public articleId: string | null = null;
  postId: string | null = null;
  article: Article | undefined;
  relatedArticles: Article[] = [];
  displayComments: Boolean = false;
  constructor(
    public articleSerivice: ArticleService,
    public route: ActivatedRoute // private datePipe: DatePipe
  ) {
    this.articleId = '';
  }
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.articleId = params.get('id');
      if (this.articleId) {
        this.articleSerivice.getPostById(this.articleId).subscribe(
          (article: Article | undefined) => {
            if (article) {
              this.article = article;
              if (article.image) {
                article.image = this.convertBase64ToImage(article.image);
              }
              this.fetchRelatedArticles(article.category); // Fetch related articles
            }
            // console.log(article);
          },
          (error) => {
            console.error('Error fetching post', error);
          }
        );
      }
    });
  }
  fetchRelatedArticles(category: any) {
    this.articleSerivice.getPosts().subscribe(
      (articles: Article[]) => {
        this.relatedArticles = articles
          .filter(
            (article) =>
              article.category === category &&
              article.id !== this.articleId &&
              article.status === 'published'
          )
          .map((article) => ({
            ...article,
            imageUrl: this.convertBase64ToImage(article.image),
          }));

        // Now, this.relatedArticles contains the precomputed image URLs
      },
      (error) => {
        console.error('Error fetching related articles', error);
      }
    );
  }

  openSidebar() {
    this.displayComments = !this.displayComments;

    console.log(this.displayComments);

    // document.querySelector('.comments-sidebar')?.classList.add('open');
  }

  convertBase64ToImage(base64: string): string {
    const binary = atob(base64.split(',')[1]); // Decode the base64 string
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' }); // Create a Blob from the binary data
    return URL.createObjectURL(blob); // Generate an object URL from the Blob
  }

  // Fetch comments for the post
  //   this.appartmentService.getCommentsByPostId(this.postId).subscribe(
  //     (postcomments: Comments[]) => {
  //       this.comments = postcomments;
  //     },
  //     (error) => {
  //       this.error = error.message || 'Error fetching comments'; // Handle or display error message
  //     }
  //   );
  // } else {
  //   console.warn('Post ID is null or undefined');
  // }
  // });
  // }
}
