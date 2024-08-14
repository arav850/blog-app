export class User {
  id: any;
  userId?: string;
  fullName: string;
  email: string;
  password: string;
  role: 'author' | 'admin' | 'reader';
  favourites: any[];
  views: number;

  constructor() {
    this.id = '';
    this.userId = '';
    this.fullName = '';
    this.email = '';
    this.password = '';
    this.role = 'reader';
    this.favourites = [];
    this.views = 0;
  }
}
