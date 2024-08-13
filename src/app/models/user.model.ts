export class User {
  id: any;
  userId?: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
  favourites: any[];

  constructor() {
    this.id = '';
    this.userId = '';
    this.fullName = '';
    this.email = '';
    this.password = '';
    this.role = '';
    this.favourites = [];
  }
}
