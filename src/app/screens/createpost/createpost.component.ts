import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Appartmentservice } from '../../services/appartmentService.service';
import { Post } from '../../models/Post.model';
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'app-createpost',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './createpost.component.html',
  styleUrl: './createpost.component.scss',
})
export class CreatepostComponent {
  isSubmitting: boolean = false;
  // post: Post = new Post();
  post: Post = new Post(); // Initialize the Post model
  selectedFiles: File[] = [];

  public http = inject(HttpClient);

  public appartmentService = inject(Appartmentservice);
  router = inject(Router);
  constructor() {}

  onFileSelected(event: any) {
    this.selectedFiles = [];
    this.post.images = [];
    this.selectedFiles = Array.from(event.target.files);
    // console.log('Selected files:', this.selectedFiles);
    const promises = this.selectedFiles.map((file) =>
      this.convertToBase64(file)
    );
    Promise.all(promises).then((base64Images) => {
      this.post.images = base64Images.map((base64) => ({
        url: base64,
        public_id: 'qwe', // You can set a unique identifier or leave it empty
      }));
      console.log('Base64 Images:', this.post.images);
    });
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  onSubmit() {
    if (this.isSubmitting) {
      return; // Prevent multiple submissions
    }
    this.isSubmitting = true;
    this.post.id = String(this.generateRandomId());
    this.appartmentService.createPost(this.post).subscribe(
      (res: Post) => {
        alert('Post Created Successfully');
        // console.log('Post created successfully:', res);
        // Additional actions on success, like navigating to another page or showing a success message
      },
      (error: any) => {
        console.error('Error creating post:', error);
        this.isSubmitting = false;
        // Handle the error, e.g., show an error message to the user
      }
    );
    this.router.navigate(['']);
  }
  private generateRandomId(): number {
    return Math.floor(Math.random() * 1000);
  }
}
