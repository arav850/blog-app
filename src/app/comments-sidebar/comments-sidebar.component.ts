import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Comments } from '../models/Comments.model';
import { CommentService } from '../services/commentsService.service';

@Component({
  selector: 'comments-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments-sidebar.component.html',
  styleUrls: ['./comments-sidebar.component.scss'],
})
export class CommentsSidebarComponent {
  newComment: Comments = new Comments();
  replyText: { [key: string]: string } = {}; // store reply texts keyed by comment ID
  comments: Comments[] = [];
  postId: string = '';
  articleId: string = '';

  constructor(
    private commentService: CommentService,
    public route: ActivatedRoute,
    public cookie: CookieService
  ) {}
  isLoggedIn: boolean = false;
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.articleId = params.get('id') ?? '';
      this.loadComments();
    });
    //to disable the input field of (postcomment)
    this.checkUserLogin();
  }
  checkUserLogin() {
    const userDetails = this.cookie.get('userDetails');
    this.isLoggedIn = !!userDetails; // Check if user details are present
  }
  postComment() {
    if (!this.isLoggedIn) {
      alert('Login to give comment');
      return;
    }
    this.route.paramMap.subscribe((params) => {
      this.articleId = params.get('id') ?? '';
    });
    const userDetails = JSON.parse(this.cookie.get('userDetails'));
    this.newComment.userName = userDetails.fullName;
    this.newComment.userId = userDetails.userId;
    this.newComment.id = String(this.generateRandomId());
    this.newComment.articleId = this.articleId;
    this.commentService.postComment(this.newComment).subscribe((data) => {
      this.loadComments();
      this.newComment = new Comments();
    });
  }

  generateRandomId(): number {
    return Math.floor(Math.random() * 1000);
  }

  replyToComment(parentComment: Comments) {
    console.log(parentComment);
    if (parentComment.text != null) {
      const reply: Comments = new Comments();
      reply.text = this.replyText[parentComment.id];
      reply.articleId = this.articleId;
      reply.userId = JSON.parse(this.cookie.get('userDetails')).userId;
      reply.userName = JSON.parse(this.cookie.get('userDetails')).fullName;
      reply.id = String(this.generateRandomId());
      reply.replies = [];
      reply.date = new Date();
      reply.likes = 0;
      parentComment.replies.push(reply); // Push reply to the parent comment's replies array

      this.commentService.updateComment(parentComment).subscribe(() => {
        this.loadComments();
        this.replyText[parentComment.id] = ''; // Reset reply text
      });
    } else {
      alert('comment shoudnot be null.');
      console.error('comment shoudnot be null.');
    }
  }

  loadComments() {
    this.commentService.getComments(this.articleId).subscribe((comments) => {
      this.comments = comments.map((comment) => ({
        ...comment,
        showReplies: false, // Initialize `showReplies` as false
      }));
    });
  }

  likeComment(comment: Comments) {
    comment.likes++;
    this.commentService.updateComment(comment).subscribe();
  }

  toggleReplies(comment: Comments) {
    comment.showReplies = !comment.showReplies;
  }

  sortComments(criteria: 'newest' | 'oldest' | 'mostLiked') {
    switch (criteria) {
      case 'newest':
        this.comments.sort((a, b) => b.date.getTime() - a.date.getTime());
        break;
      case 'oldest':
        this.comments.sort((a, b) => a.date.getTime() - b.date.getTime());
        break;
      case 'mostLiked':
        this.comments.sort((a, b) => b.likes - a.likes);
        break;
    }
  }
}
