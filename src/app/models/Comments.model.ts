export class Comments {
  id: string;
  userId: string;
  articleId: string;
  userName: string;
  author: string;
  text: string;
  replies: Comments[];
  date: Date;
  likes: number;
  showReplies?: boolean;

  constructor() {
    this.id = '';
    this.userId = '';
    this.userName = '';
    this.articleId = '';
    this.author = '';
    this.text = '';
    this.replies = [];
    this.date = new Date();
    this.likes = 0;
  }
}
