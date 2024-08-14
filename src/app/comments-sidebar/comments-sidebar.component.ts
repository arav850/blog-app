import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Correct import
import { ActivatedRoute } from '@angular/router';
import { Comments } from '../models/Comments.model';
import { CommentService } from '../services/commentsService.service';

@Component({
  selector: 'comments-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule], // Correct usage here
  templateUrl: './comments-sidebar.component.html',
  styleUrls: ['./comments-sidebar.component.scss'],
})
export class CommentsSidebarComponent {
  public articleId: string | null = null;

  newComment: Comments = new Comments();
  replyText: { [key: string]: string } = {}; // To store reply texts keyed by comment ID
  comments: Comments[] = [];
  postId: string = ''; // This should be dynamically set based on the current post
  constructor(
    private commentService: CommentService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadComments();
  }
  postComment() {
    // this.newComment.postId = this.articleId;
    this.route.paramMap.subscribe((params) => {
      this.articleId = params.get('id');
    });
    console.log(this.articleId);

    this.commentService.postComment(this.newComment).subscribe((data) => {
      console.log(data);
      this.loadComments();
      this.newComment = new Comments();
    });
  }
  replyToComment(parentComment: Comments) {
    const reply: Comments = new Comments();
    reply.text = this.replyText[parentComment.id];
    reply.postId = this.postId;
    reply.replies = []; // Initialize replies as empty array

    // Add the reply to the parent comment's replies array
    parentComment.replies.push(reply);
    this.commentService.postComment(reply).subscribe(() => {
      this.loadComments();
      this.replyText[parentComment.id] = ''; // Reset reply text
    });
  }

  loadComments() {
    this.commentService.getComments(this.postId).subscribe((comments) => {
      this.comments = comments;
    });
  }

  likeComment(comment: Comments) {
    comment.likes++;
    this.commentService.updateComment(comment).subscribe();
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
