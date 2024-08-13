import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArticleService } from '../../services/articleService.service';
import { ActivatedRoute } from '@angular/router';
import { Article } from '../../models/Article.model';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-viewarticle',
  standalone: true,
  imports: [],
  templateUrl: './viewarticle.component.html',
  styleUrl: './viewarticle.component.scss',
})
export class ViewarticleComponent {
  public articleid: string | null = null;
  postId: string | null = null;
  article: Article | undefined;

  constructor(
    public articles: ArticleService,
    public route: ActivatedRoute // private datePipe: DatePipe
  ) {
    this.articleid = '';
  }
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.articleid = params.get('id');

      if (this.articleid) {
        this.articles.getPostById(this.articleid).subscribe(
          (article: Article | undefined) => {
            if (article) {
              this.article = article;
            }
            if (article?.image) {
              article.image = this.convertBase64ToImage(article.image);
            }
            console.log(article);
          },
          (error) => {
            console.error('Error fetching post', error);
          }
        );
      }
    });
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
