// comment.model.ts
export class Comments {
  postId: string;
  author: string;
  text: string;
  replies: Comments[];

  constructor() {
    this.postId = '';
    this.author = '';
    this.text = '';
    this.replies = [];
  }
}
