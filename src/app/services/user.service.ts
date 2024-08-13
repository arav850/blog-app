import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '../models/user.model';
import { RouterModule } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: User = new User();
  http = inject(HttpClient);
  cookie = inject(CookieService);
  private apiUrl = 'http://localhost:3000/createUser';
  userId: string = this.cookie.get('userId');

  //   addToFavourites(postId: string): Observable<any> {
  //     console.log('his');

  //     this.user.favourites.push(postId);
  //     const url = `${this.apiUrl}/${this.userId}`;

  //     return this.http.patch(url, { favourites: this.user.favourites }).pipe(
  //       catchError((error) => {
  //         console.error('Error adding to favorites', error);
  //         return of(null); // or throw error if needed
  //       })
  //     );
  //   }
  getUserById(userId: string): Observable<User | null> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((users) => users.find((user) => user.userId === userId) || null),
      catchError((error) => {
        console.error('Error fetching user', error);
        return of(null); // or throw error if needed
      })
    );
  }

  addToFavourites(postId: string): Observable<any> {
    return this.getUserById(this.userId).pipe(
      switchMap((user) => {
        if (user) {
          user.favourites.push(postId);
          const url = `${this.apiUrl}/${user.id}`;
          return this.http.patch(url, { favourites: user.favourites }).pipe(
            catchError((error) => {
              console.error('Error adding to favorites', error);
              return of(null);
            })
          );
        } else {
          console.error('User not found');
          return of(null);
        }
      }),
      catchError((error) => {
        console.error('Error updating favorites', error);
        return of(null);
      })
    );
  }
  getFavorites(): Observable<any> {
    return this.getUserById(this.userId).pipe(
      switchMap((user) => {
        if (user) {
          const url = `${this.apiUrl}/${user.id}`;

          return this.http.get(url).pipe(
            catchError((error) => {
              console.error('Error adding to favorites', error);
              return of(null); // or handle error as needed
            })
          );
        } else {
          // console.error('User not found');
          return of(null); // or handle the case where the user is not found
        }
      }),
      catchError((error) => {
        console.error('Error updating favorites', error);
        return of(null); // or handle error as needed
      })
    );
  }
}
