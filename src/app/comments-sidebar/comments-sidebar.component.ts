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
  newComment: Comments = new Comments();
  replyText: { [key: string]: string } = {}; // store reply texts keyed by comment ID
  comments: Comments[] = [];
  postId: string = '';
  articleId: string = '';

  constructor(
    private commentService: CommentService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.articleId = params.get('id') ?? '';
      this.loadComments();
    });
  }

  postComment() {
    this.route.paramMap.subscribe((params) => {
      this.articleId = params.get('id') ?? '';
    });

    this.commentService.postComment(this.newComment).subscribe((data) => {
      this.loadComments();
      this.newComment = new Comments();
    });
  }

  replyToComment(parentComment: Comments) {
    if (this.articleId) {
      const reply: Comments = new Comments();
      reply.text = this.replyText[parentComment.id];
      reply.articleId = this.articleId;
      reply.replies = [];

      parentComment.replies.push(reply);
      this.commentService.postComment(reply).subscribe(() => {
        this.loadComments();
        this.replyText[parentComment.id] = ''; // Reset reply text
      });
    } else {
      console.error('Article ID is null.');
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
