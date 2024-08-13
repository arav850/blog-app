import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public login: AuthService = inject(AuthService);
  isUserlogin: boolean;
  http = inject(HttpClient);
  router = inject(Router);
  cookie = inject(CookieService);
  userDetails: User = new User();
  constructor() {
    this.isUserlogin = false;
  }

  loginForm() {
    this.login.findUser(this.userDetails).subscribe((user: User | null) => {
      if (user) {
        if (user.userId) {
          this.cookie.set('userId', user.userId);
        }
        this.cookie.set('userRole', user.role);
        this.cookie.set('userName', user.fullName);

        this.router.navigate(['']);
      } else {
        alert('User Not Found');
      }
    });
  }
  googleSignIn() {
    this.login.signInWithGoogle().subscribe({
      next: (user) => {
        if (user) {
          //this.cookie.set('userId', user.userId);
          // Navigate to another page or update the UI as needed
        }
      },
      error: (err) => {
        console.error('Google Sign-In Error:', err);
      },
    });
  }
}
