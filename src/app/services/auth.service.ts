import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '../models/user.model';
import { Router, RouterModule } from '@angular/router';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { FirebaseService } from './firebase.service';
import {
  fetchSignInMethodsForEmail,
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
          alert('Firebase registration successful');
          console.log(res);
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
    return this.http.post<User>(this.apiUrl, userDetails).pipe(
      catchError((e) => {
        console.error('Error:', e);
        // Rethrow the error so that the caller can handle it
        return throwError(() => e);
      })
    );
  }

  signInWithGoogle(): Observable<User> {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    return new Observable<User>((observer) => {
      signInWithPopup(auth, provider)
        .then((result) => {
          const firebaseUser = result.user;
          const email = firebaseUser.email || '';

          // Step 1: Check if the user exists in Firebase
          fetchSignInMethodsForEmail(auth, email)
            .then((signInMethods) => {
              if (signInMethods.length > 0) {
                // User already exists in Firebase
                const existingUser: User = {
                  id: null, // or any default value
                  userId: firebaseUser.uid,
                  fullName: firebaseUser.displayName || '',
                  email: email,
                  password: '123456', // password can be left blank or set to a default value
                  role: 'reader', // Default role
                  favourites: [],
                  views: 0,
                };
                observer.next(existingUser);
                observer.complete();
              } else {
                // User does not exist in Firebase, proceed to create a new user
                const newUser: User = {
                  id: null,
                  userId: firebaseUser.uid,
                  fullName: firebaseUser.displayName || '',
                  email: email,
                  password: '123456', // Set a default password
                  role: 'reader', // Default role
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
                    observer.error(
                      'Error registering user in JSON server: ' + err.message
                    );
                  },
                });
              }
            })
            .catch((error) => {
              observer.error('Error checking Firebase user: ' + error.message);
            });
        })
        .catch((error) => {
          observer.error('Google Sign-In Error: ' + error.message);
        });
    });
  }

  // Example method to get a user by email from the JSON server
  getUserByEmail(email: string): Observable<User | null> {
    return this.http
      .get<User[]>(`http://localhost:3000/createUser?email=${email}`)
      .pipe(map((users) => (users.length > 0 ? users[0] : null)));
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
