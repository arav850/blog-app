// post.model.ts
import { Comments } from './Comments.model';

export class Post {
  id: string;
  apartment: string;
  name: string;
  isShared: boolean;
  streetAddress: string;
  squareFeet: string;
  leaseType: string;
  expectedRent: string;
  negotiable: boolean;
  utilitiesIncluded: boolean;
  furnished: boolean;
  amenities: {
    Gym: boolean;
    PowerBackup: boolean;
    LaundryService: boolean;
    SwimmingPool: boolean;
  };
  title: string;
  description: string;
  images: { url: string; public_id: string }[];
  constructor() {
    this.id = '';
    this.apartment = '';
    this.name = '';
    this.isShared = false;
    this.streetAddress = '';
    this.squareFeet = '';
    this.leaseType = '';
    this.expectedRent = '';
    this.negotiable = false;
    this.utilitiesIncluded = false;
    this.furnished = false;
    this.amenities = {
      Gym: false,
      PowerBackup: false,
      LaundryService: false,
      SwimmingPool: false,
    };
    this.title = '';
    this.description = '';
    this.images = [];
  }
}
