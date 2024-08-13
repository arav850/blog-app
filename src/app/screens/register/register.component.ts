import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);
  userDetails: User = new User();
  formValue: any;
  userList: User[] = [];
  // onSubmit() {
  //   this.formValue = this.userObj;
  //   console.log(this.formValue);
  // }
  resetForm() {
    // this.userDetails = {
    //   fullName: '',
    //   email: '',
    //   password: '',
    //   role: '',
    // };
  }
  submitForm() {
    const submitButton = document.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = true;
    }
    this.userDetails.userId = String(this.generateRandomId());
    this.authService.register(this.userDetails).subscribe({
      next: (user) => {
        if (user) {
          alert('user Created Succesfull');
          this.router.navigate(['login']);
        } else {
        }
      },
      error: (err) => {
        // Handle error here
        console.error('Registration error:', err);
      },
    });
  }
  private generateRandomId(): number {
    return Math.floor(Math.random() * 1000);
  }
}
