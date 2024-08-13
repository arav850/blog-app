import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
import { Article } from '../../models/Article.model';
import { ArticleService } from '../../services/articleService.service';

@Component({
  selector: 'app-createarticle',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './createarticle.component.html',
  styleUrl: './createarticle.component.scss',
})
export class CreatearticleComponent {
  articleData: Article = new Article();
  selectedCategory: string | null = null;
  constructor(
    public articleService: ArticleService // public toastr: ToastrService
  ) {}

  createArticle() {
    // Assign the selected category to the articleData object
    this.articleData.id = String(this.generateRandomId());
    this.articleService.createPost(this.articleData).subscribe({
      next: (article) => {
        // this.toastr.success('Article Created Success');
        // console.log(article);
        //this.router.navigate(['login']);
      },
      error: (err) => {
        // Handle error here
        console.error('Registration error:', err);
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
        this.articleData.thumbnail = reader.result as string; // Store Base64 string
      };
      reader.readAsDataURL(file);
    }
  }
  onImageSelected(event: any) {
    // Logic to handle image upload (if separate from thumbnail)

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.articleData.image = reader.result as string; // Store Base64 string
      };
      reader.readAsDataURL(file);
    }
  }
}
