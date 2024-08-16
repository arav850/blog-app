import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { MenucardComponent } from './menucard/menucard.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './screens/login/login.component';
import { CreatepostComponent } from './screens/createpost/createpost.component';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FirebaseAppModule } from '@angular/fire/app';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../../environment/environment';
// import { FirebaseModule } from '../../firebase.module';
import { appConfig } from './app.config';
import { DatePipe } from '@angular/common';
import { CommentsSidebarComponent } from './comments-sidebar/comments-sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    //BrowserModule,
    RouterOutlet,
    NavbarComponent,
    HomeComponent,
    MenucardComponent,
    FooterComponent,
    LoginComponent,
    CreatepostComponent,
    // FirebaseModule,
    CommonModule,
    CommentsSidebarComponent,

    // AngularFireModule.initializeApp(environment.firebaseConfig),

    // FirebaseModule,
    // ToastrModule,
    // BrowserAnimationsModule,
    // CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'rent-hub';
}
