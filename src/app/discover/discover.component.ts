import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Article } from '../models/Article.model';
import { User } from '../models/user.model';
import { ArticleService } from '../services/articleService.service';
import { UserService } from '../services/user.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Include FormsModule here
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'],
})
export class DiscoverComponent {
  selectedFilter: string = 'Select';
  searchText: string = '';
  authorsList: User[] = [];
  articles: Article[] = [];
  filteredResults: (Article | User)[] = [];

  constructor(
    public userService: UserService,
    public articleService: ArticleService
  ) {}

  ngOnInit() {
    this.fetchAuthors();
    this.fetchArticles();
  }

  fetchAuthors() {
    this.userService.getAuthors('author').subscribe(
      (authorsList: User[]) => {
        this.authorsList = authorsList;
      },
      (error) => {
        console.error('Error fetching authors', error);
      }
    );
  }

  fetchArticles() {
    this.articleService.getPosts().subscribe(
      (data: Article[]) => {
        this.articles = data.filter(
          (article) => article.status === 'published'
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  onSearch() {
    //console.log(this.selectedFilter);

    if (this.selectedFilter === 'Article') {
      console.log('insideif');
      this.articles = this.articles.filter((article) =>
        article.title.toLowerCase().includes(this.searchText.toLowerCase())
      );
      console.log(this.articles);
    } else if (this.selectedFilter === 'Author') {
      this.authorsList = this.authorsList.filter((author) =>
        author.fullName.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.articles = [];
    }
    console.log(this.filteredResults);
  }
}
