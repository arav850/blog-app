export class Article {
  id: any;
  title: string;
  thumbnail: string;
  image: string;
  description: string;
  authorName: string;
  publishDate: Date | string;
  category: string;

  constructor() {
    this.id = '';
    this.title = '';
    this.thumbnail = '';
    this.image = '';
    this.description = '';
    this.authorName = '';
    this.publishDate = new Date();
    this.category = '';
  }
}
