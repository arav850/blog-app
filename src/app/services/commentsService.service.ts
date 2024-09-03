import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comments } from '../models/Comments.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = 'http://localhost:3000/Comments'; // Update with your API URL

  constructor(private http: HttpClient) {}

  postComment(comment: Comments): Observable<Comments> {
    return this.http.post<Comments>(this.apiUrl, comment);
  }

  getComments(postId: string): Observable<Comments[]> {
    return this.http.get<Comments[]>(`${this.apiUrl}?articleId=${postId}`);
  }

  updateComment(comment: Comments): Observable<Comments> {
    return this.http.put<Comments>(`${this.apiUrl}/${comment.id}`, comment);
  }
}
