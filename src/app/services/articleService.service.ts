import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Post } from '../models/Post.model';
import { catchError, map, Observable, of } from 'rxjs';
import { Article } from '../models/Article.model';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(public http: HttpClient) {}
  public articleUrl = 'http://localhost:3000/articles';

  createPost(data: Article): Observable<Article> {
    return this.http.post<Article>(this.articleUrl, data);
  }
  getPosts(): Observable<Article[]> {
    return this.http.get<Article[]>(this.articleUrl);
  }
  getPostById(id: string): Observable<Article | undefined> {
    const url = `${this.articleUrl}/${id}`;
    return this.http.get<Article>(url).pipe(
      catchError((error) => {
        console.error('Error fetching article:', error);
        return of(undefined);
      })
    );
  }
  saveArticle(article: Article): Observable<Article> {
    if (article.id) {
      // Update an existing article
      return this.http.put<Article>(
        `${this.articleUrl}/${article.id}`,
        article
      );
    } else {
      // Create a new article
      return this.http.post<Article>(this.articleUrl, article);
    }
  }
  getDraftsByAuthor(authorId: string): Observable<Article> {
    return this.http.get<Article>(
      `${this.articleUrl}?authorId=${authorId}&status=draft`
    );
  }
}
