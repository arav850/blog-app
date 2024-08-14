export class Comments {
  id: string; // Unique identifier for each comment
  postId: string; // ID of the post this comment belongs to
  author: string; // Author of the comment
  text: string; // Content of the comment
  replies: Comments[]; // Replies to this comment
  date: Date; // Date when the comment was posted
  likes: number; // Number of likes

  constructor() {
    this.id = '';
    this.postId = '';
    this.author = '';
    this.text = '';
    this.replies = [];
    this.date = new Date();
    this.likes = 0;
  }
}
