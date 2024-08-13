import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  // private login: AuthService = inject(AuthService);
  userRole: string | null = null;
  cookie = inject(CookieService);
  router = inject(Router);
  userName: string = '';
  searchText: any;
  ngDoCheck() {
    this.userRole = this.cookie.get('userRole');
    this.userName = this.cookie.get('userName');
  }

  logout() {
    this.cookie.delete('userRole');
    this.cookie.delete('userId');
    this.cookie.delete('userName');

    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }
  onSearch(): void {
    // console.log(this.searchText);
    this.router.navigate(['/'], {
      queryParams: { search: this.searchText },
    });
    //this.searchService.setSearchText(this.searchText);
  }
}
