import { Component, inject } from '@angular/core';
import { MenucardComponent } from '../menucard/menucard.component';
import { CommonModule } from '@angular/common';
import { Appartmentservice } from '../services/appartmentService.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { Post } from '../models/Post.model';
import { Article } from '../models/Article.model';
import { ArticleService } from '../services/articleService.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MenucardComponent, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  posts: Post[] = [];
  error = ''; // Stores any error message
  searchText: any;
  search: any;
  filteredPosts: Post[] = [];
  favorites: string[] = []; // List of favorite post IDs
  currentPage = 1; // Tracks the current page
  itemsPerPage = 5; // Number of items per page
  paginatedArticles: Article[] = []; // Articles to display on the current page

  router = inject(Router);
  userService = inject(UserService);
  public articles: Article[] = [];

  constructor(
    private appartmentService: Appartmentservice,
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {}

  ngOnInit() {
    this.articleService.getPosts().subscribe(
      (data: Article[]) => {
        this.articles = data;
        this.updatePaginatedArticles();
      },
      (err) => {
        console.log(err);
      }
    );

    this.route.queryParams.subscribe((params) => {
      this.search = params['search'] || null;
      this.applyFilters();
    });

    // Fetch favorites
    // this.userService.getFavorites().subscribe((favorites: string[]) => {
    //   this.favorites = favorites;
    // });
  }
  updatePaginatedArticles(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedArticles = this.articles.slice(startIndex, endIndex);
  }
  onThumbnailClick(articleId: number) {
    this.router.navigate(['/viewarticle', articleId]);
  }
  applyFilters(): void {
    if (this.search) {
      this.filteredPosts = this.posts.filter(
        (post) =>
          post.title.toLowerCase().includes(this.search.toLowerCase()) ||
          post.description.toLowerCase().includes(this.search.toLowerCase())
      );
    } else {
      this.filteredPosts = this.posts; // No filter applied
    }
  }
  goToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.updatePaginatedArticles();
  }
  get totalPages(): number[] {
    const pages = Math.ceil(this.articles.length / this.itemsPerPage);
    return Array.from({ length: pages }, (_, i) => i + 1);
  }

  viewDetails(postId: string) {
    this.router.navigate(['/Viewpost', postId]);
  }

  addToFavorites(postId: string) {
    this.userService.addToFavourites(postId).subscribe(
      (response) => {
        if (!Array.isArray(this.favorites)) {
          this.favorites = [];
        }
        if (response) {
          if (!this.favorites.includes(postId)) {
            this.favorites.push(postId);
          }
        } else {
          console.warn('Failed to add post to favorites');
        }
      },
      (error) => {
        console.error('Error in addToFavorites', error);
      }
    );
  }

  isFavorite(postId: string): boolean {
    return Array.isArray(this.favorites) && this.favorites.includes(postId);
  }
}
