import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../../shared/services/blog.service';
import { Category } from '../../../shared/Models/Category';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-new-blog',
  templateUrl: './new-blog.component.html',
  styleUrl: './new-blog.component.css',
})
export class NewBlogComponent implements OnInit {
  categories: Category[] = [];
  blogForm!: FormGroup;
  isModalOpen!: boolean;
  firstStep!: boolean;
  secondStep!: boolean;
  selectedFileNewBlog!: any;
  imagePreview: string | null = null;

  tags: string[] = [];
  newTag: string = '';

  tinymceConfig = {
    api_key: environment.tinymceApiKey,
    heigh: 400,
    menubar: false,
    plugins: [
      'advlist',
      'autolink',
      'lists',
      'link',
      'image',
      'charmap',
      'preview',
      'anchor',
      'searchreplace',
      'visualblocks',
      'code',
      'fullscreen',
      'insertdatetime',
      'media',
      'table',
      'help',
      'wordcount',
    ],
    toolbar:
      'undo redo | blocks | bold italic forecolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | help | wordcount',
    content_style:
      'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px }',
    skin: 'oxide',
    content_css: 'default',
    branding: false,
    resize: true,
    setup: (editor: any) => {
      editor.on('change', () => {
        const content = editor.getContent();
        this.blogForm.patchValue({ description: content });
      });
    },

    init_instance_callback: (editor: any) => {
      editor.on('blur', () => {
        const content = editor.getContent({ format: 'text' });
        if (content.trim().length < 50) {
          this.blogForm.get('description')?.setErrors({ minlength: true });
        }
      });
    },
  };

  constructor(
    private blogService: BlogService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.blogForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      ],
      description: ['', [Validators.required, Validators.minLength(50)]],
      imageUrl: [null, Validators.required],
      categoryId: ['', Validators.required],
      // tags: [[]]
    });
  }

  ngOnInit(): void {
    this.blogService.getAllCategories().subscribe(
      (response) => {
        console.log('Categories successfully fetched');
        this.categories = response;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.blogForm.valid) {
      const formData = new FormData();
      console.log(this.blogForm.value.title);
      console.log(this.selectedFileNewBlog);

      formData.append('title', this.blogForm.value.title);
      formData.append('description', this.blogForm.value.description);
      formData.append('categoryId', this.blogForm.value.categoryId);
      formData.append(
        'imageUrl',
        this.selectedFileNewBlog,
        this.selectedFileNewBlog.name
      );
      console.log('=== FormData Debug ===');
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      // Alternative: Check specific keys
      console.log('title:', formData.get('title'));
      console.log('description:', formData.get('description'));
      console.log('categoryId:', formData.get('categoryId'));
      console.log('imageUrl:', formData.get('imageUrl'));

      this.blogService.createBlog(formData).subscribe(
        (response) => {
          console.log('Blog created successfully:', response);
          this.firstStep = false;
          this.secondStep = true;
          setTimeout(() => {
            this.router.navigate([`/blog/${response._id}`]);
          }, 2000);
        },
        (error) => {
          console.error('Error creating blog:', error);
        }
      );
    } else {
      Object.keys(this.blogForm.controls).forEach((key) => {
        this.blogForm.get(key)?.markAsTouched();
      });
    }
  }

  openModal() {
    this.isModalOpen = true;
    this.firstStep = true;
    this.secondStep = false;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  onProcessDone() {
    this.closeModal();
    this.router.navigate(['/home']);
  }

  onFileSelectedNewInstructor(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB permitido.');
        return;
      }

      this.selectedFileNewBlog = file;
      this.blogForm.patchValue({ imageUrl: file });

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
    console.log(this.selectedFileNewBlog);
  }

  // Handle drag and drop for image
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        this.selectedFileNewBlog = file;
        this.blogForm.patchValue({ imageUrl: file });

        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  }
  addTag() {
    if (
      this.newTag.trim() &&
      !this.tags.includes(this.newTag.trim()) &&
      this.tags.length < 5
    ) {
      this.tags.push(this.newTag.trim());
      this.blogForm.patchValue({ tags: this.tags });
      this.newTag = '';
    }
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
    this.blogForm.patchValue({ tags: this.tags });
  }

  resetForm() {
    this.blogForm.reset();
    this.selectedFileNewBlog = null;
    this.imagePreview = null;
    this.tags = [];
    this.newTag = '';
    this.firstStep = false;
    this.secondStep = false;
  }
  getWordCount(): number {
    const content = this.blogForm.get('description')?.value || '';
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    return textContent ? textContent.split(/\s+/).length : 0;
  }

  getCharCount(): number {
    const content = this.blogForm.get('description')?.value || '';
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length;
  }
}
