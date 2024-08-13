import { Component, inject } from '@angular/core';
import { Post } from '../../models/Post.model';
import { Router, RouterModule, ActivatedRoute, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Appartmentservice } from '../../services/appartmentService.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-myfavourites',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './myfavourites.component.html',
  styleUrl: './myfavourites.component.scss',
})
export class MyfavouritesComponent {
  userService = inject(UserService);
  apartmentService = inject(Appartmentservice);
  router = inject(Router);

  constructor(private route: ActivatedRoute) {}
  user: User = new User();
  posts: Post[] = [];
  postsFound: boolean = false;

  error: any;
  ngOnInit() {
    this.userService.getFavorites().subscribe(
      (user: User) => {
        this.user = user;

        if (user.favourites && user.favourites.length > 0) {
          this.loadFavouritePosts(user.favourites);
          this.postsFound = true;
        } else {
          console.log('No favourites found.');
        }
      },
      (error: any) => {
        this.error = error.message;
        console.error('Error fetching user favorites:', error);
      }
    );
  }
  loadFavouritePosts(favouritePostIds: string[]) {
    const postObservables = favouritePostIds.map((postId) =>
      this.apartmentService.getPostById(postId)
    );

    forkJoin(postObservables).subscribe(
      (posts: (Post | undefined)[]) => {
        this.posts = posts.filter((post) => post !== undefined) as Post[]; // Filter out undefined values
        console.log('Favourite posts:', this.posts);
      },
      (error: any) => {
        this.error = error.message;
        console.error('Error fetching posts:', error);
      }
    );
  }
  viewDetails(postId: string) {
    this.router.navigate(['/Viewpost', postId]);
  }
}
