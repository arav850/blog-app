import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Appartmentservice } from '../../services/appartmentService.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../models/Post.model';
import { CommonModule } from '@angular/common';
import { Comments } from '../../models/Comments.model';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-viewpost',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './viewpost.component.html',
  styleUrls: ['./viewpost.component.scss'],
})
export class ViewpostComponent implements OnInit {
  postId: string | null = null;
  post: Post | undefined;
  availableAmenities: { name: string; value: boolean }[] = [];
  commentText: string = '';
  comments: Comments[] = [];
  newComment = new Comments();
  showReplies: boolean[] = [];
  error: any;
  cookie = inject(CookieService);
  constructor(
    private route: ActivatedRoute,
    private appartmentService: Appartmentservice
  ) {}
  replyText: { [key: number]: string } = {};
  replyInputVisible: { [key: number]: boolean } = {};
  // isUserLogin: boolean = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.postId = params.get('id');
      if (this.postId) {
        this.appartmentService.getPostById(this.postId).subscribe(
          (post: Post | undefined) => {
            if (post) {
              this.post = post;
              if (this.post.amenities) {
                this.availableAmenities = Object.entries(this.post.amenities)
                  .map(([name, value]) => ({ name, value }))
                  .filter((amenity) => amenity.value); // Only keep amenities with value true
              }
            } else {
              console.warn('Post not found for ID:', this.postId);
            }
          },
          (error) => {
            console.error('Error fetching post', error);
          }
        );

        // Fetch comments for the post
        this.appartmentService.getCommentsByPostId(this.postId).subscribe(
          (postcomments: Comments[]) => {
            this.comments = postcomments;
          },
          (error) => {
            this.error = error.message || 'Error fetching comments'; // Handle or display error message
          }
        );
      } else {
        console.warn('Post ID is null or undefined');
      }
    });
    // if (this.cookie.get('userName')) {
    //   console.log('true');
    //   this.isUserLogin = true;
    // } else {
    //   this.isUserLogin = false;
    //   console.log('false');
    // }
  }
  toggleReplies(index: number): void {
    this.showReplies[index] = !this.showReplies[index];
  }

  addComment() {
    if (this.postId) {
      this.newComment.postId = this.postId;
    }
    this.newComment.author = this.cookie.get('userName');
    this.appartmentService.addComment(this.newComment).subscribe(
      (comment: Comments) => {
        this.comments.push(comment);
        this.newComment.text = '';
      },
      (error) => {
        console.error('Error adding comment', error);
      }
    );
    this.commentText = '';
  }
  addReply(comment: Comments, index: number) {
    const newReply = new Comments();
    newReply.author = 'Current User'; // Replace with actual user info
    newReply.text = this.replyText[index];
    newReply.postId = comment.postId; // Assuming the reply is related to the post

    // Add the reply to the comment's replies
    this.appartmentService.addComment(newReply).subscribe(
      (response: Comments) => {
        if (response) {
          comment.replies.push(response); // Add reply to the comment
          this.replyText[index] = ''; // Clear the reply input field
          this.replyInputVisible[index] = false; // Hide the reply input field
        } else {
          console.warn('Failed to add reply');
        }
      },
      (error) => {
        console.error('Error adding reply', error);
      }
    );
  }
  toggleReplyInput(index: number) {
    this.replyInputVisible[index] = !this.replyInputVisible[index];
  }
}
