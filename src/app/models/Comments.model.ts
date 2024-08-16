export class Comments {
  id: string;
  articleId: string;
  author: string;
  text: string;
  replies: Comments[];
  date: Date;
  likes: number;
  showReplies?: boolean;

  constructor() {
    this.id = '';
    this.articleId = '';
    this.author = '';
    this.text = '';
    this.replies = [];
    this.date = new Date();
    this.likes = 0;
  }
}
