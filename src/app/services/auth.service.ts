import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '../models/user.model';
import { Router, RouterModule } from '@angular/router';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { FirebaseService } from './firebase.service';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User = new User();
  http = inject(HttpClient);
  constructor(
    public fireAuth: AngularFireAuth,
    public router: Router // public fb: FirebaseService
  ) {}

  private apiUrl = 'http://localhost:3000/createUser';

  isuserlogin: boolean = false;

  register(userDetails: User): Observable<User> {
    // Firebase authentication for creating a new user using AngularFireAuth
    this.fireAuth
      .createUserWithEmailAndPassword(userDetails.email, userDetails.password)
      .then(
        (res) => {
          // alert('Firebase registration successful');
          // console.log(res);
        },
        (err) => {
          console.log('Firebase registration error:', err);
        }
      );

    // Registering the user in your local backend
    return this.http.post<User>(this.apiUrl, userDetails).pipe(
      catchError((error) => {
        console.error('Error creating user', error);
        return throwError(() => new Error('Error creating user'));
      })
    );
  }
  registerUser(userDetails: User): Observable<User> {
    // Registering the user in your local backend
    return this.http.post<User>(this.apiUrl, userDetails).pipe(
      catchError((error) => {
        console.error('Error creating user', error);
        return throwError(() => new Error('Error creating user'));
      })
    );
  }
  signInWithGoogle(): Observable<User> {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    return new Observable<User>((observer) => {
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;

          // Create a User object without a password
          const newUser: User = {
            id: null,
            userId: user.uid,
            fullName: user.displayName || '',
            email: user.email || '',
            password: '123456', // Password is left empty
            role: 'author', // Default role, modify if needed
            favourites: [],
            views: 0,
          };

          // Store user details in the JSON server
          this.registerUser(newUser).subscribe({
            next: (registeredUser) => {
              observer.next(registeredUser);
              observer.complete();
            },
            error: (err) => {
              observer.error(err);
            },
          });
        })
        .catch((error) => {
          // observer.error(error);
        });
    });
  }

  setLoginStatus(status: boolean) {
    this.isuserlogin = status;
  }
  getSingleUser() {}

  findUser(data: { email: string; password: string }): Observable<User | null> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((res: User[]) => {
        const user = res.find(
          (a: User) => a.email === data.email && a.password === data.password
        );

        return user || null;
      }),
      catchError((error) => {
        console.error('Error fetching user', error);
        return of(null);
      })
    );
  }

  getLoginStatus() {
    return this.isuserlogin;
  }
}
