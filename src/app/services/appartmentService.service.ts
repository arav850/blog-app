import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Post } from '../models/Post.model';
import { catchError, map, Observable, of } from 'rxjs';
import { Comments } from '../models/Comments.model';

@Injectable({
  providedIn: 'root',
})
export class Appartmentservice {
  private http = inject(HttpClient);
  public appartmentUrl = 'http://localhost:3000/apartmentList';
  public commentsUrl = 'http://localhost:3000/Comments';

  createPost(data: Post): Observable<Post> {
    return this.http.post<Post>(this.appartmentUrl, data);
  }

  getPost(): Observable<Post[]> {
    return this.http.get<Post[]>(this.appartmentUrl);
  }

  // getPostById(id: string): Observable<Post> {
  //   const apartment = this.appartmentUrl.find(a => a.id === id);
  //   return this.http.get<Post>(url);
  // }
  getPostById(id: string): Observable<Post | undefined> {
    const url = `${this.appartmentUrl}/${id}`;
    return this.http.get<Post>(url).pipe(
      catchError((error) => {
        console.error('Error fetching post:', error);
        return of(undefined);
      })
    );
  }
  setSearchText(searchText: string): void {
    // this.searchTextSubject.next(searchText);
  }

  getCommentsByPostId(postId: string): Observable<Comments[]> {
    const url = `${this.commentsUrl}`;

    let res = this.http
      .get<Comments[]>(url)
      .pipe(
        map((comments: Comments[]) =>
          comments.filter((comment) => comment.postId === postId)
        )
      );
    return res;
  }

  addComment(comment: Comments): Observable<Comments> {
    return this.http.post<Comments>(this.commentsUrl, comment);
  }
}
