export class Article {
  id: any;
  title: string;
  thumbnail: string;
  image: string;
  description: string;
  authorName: string;
  publishDate: Date | string;
  category: string;
  featured: boolean;
  status: string;
  authorId: string;

  constructor() {
    this.id = '';
    this.title = '';
    this.thumbnail = '';
    this.image = '';
    this.description = '';
    this.authorName = '';
    this.publishDate = new Date();
    this.category = '';
    this.featured = false;
    this.status = '';
    this.authorId = '';
  }
}
