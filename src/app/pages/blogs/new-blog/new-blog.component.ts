import { Component, OnInit, Input } from '@angular/core';
import { BlogService } from '../../../shared/services/blog.service';
import { Category } from '../../../shared/Models/Category';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Blog } from '../../../shared/Models/Blog';

@Component({
  selector: 'app-new-blog',
  templateUrl: './new-blog.component.html',
  styleUrl: './new-blog.component.css',
})
export class NewBlogComponent implements OnInit {
  /** When provided, switches to edit mode */
  @Input() editBlog?: Blog;

  categories: Category[] = [];
  blogForm!: FormGroup;
  isModalOpen = false;
  firstStep = true;
  secondStep = false;
  selectedFileNewBlog: File | null = null;
  imagePreview: string | null = null;
  isSubmitting = false;
  submitError: string | null = null;

  get isEditMode(): boolean {
    return !!this.editBlog;
  }

  tinymceApiKey = environment.tinymceApiKey;
  tinymceConfig = {
    height: 420,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
      'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
      'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount',
    ],
    toolbar:
      'undo redo | blocks | bold italic forecolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | removeformat | help',
    content_style:
      'body { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif; font-size: 14px; line-height: 1.7; }',
    branding: false,
    resize: true,
  };

  onEditorChange(event: any) {
    const content: string = event?.editor?.getContent() ?? '';
    this.updateDescriptionControl(content);
  }

  private updateDescriptionControl(content: string) {
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    const ctrl = this.blogForm.controls['description'];
    ctrl.setValue(content, { emitEvent: false });
    ctrl.markAsDirty();
    ctrl.markAsTouched();
    if (!plainText) {
      ctrl.setErrors({ required: true });
    } else if (plainText.length < 50) {
      ctrl.setErrors({ minlength: true });
    } else {
      ctrl.setErrors(null);
    }
  }

  constructor(
    private blogService: BlogService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.blogService.getAllCategories().subscribe({
      next: (response) => { this.categories = response; },
      error: (error) => { console.error('Error fetching categories:', error); },
    });

    // If edit mode, populate the form
    if (this.editBlog) {
      this.isModalOpen = true;
      this.firstStep = true;
      this.blogForm.patchValue({
        title: this.editBlog.title,
        description: this.editBlog.description,
        categoryId: this.editBlog.categoryId,
      });
      // imageUrl not required when editing if one already exists
      if (this.editBlog.imageUrl) {
        this.imagePreview = this.editBlog.imageUrl;
        this.blogForm.get('imageUrl')?.clearValidators();
        this.blogForm.get('imageUrl')?.updateValueAndValidity();
      }
    }
  }

  private buildForm() {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      // No built-in validators on description — TinyMCE manages this manually
      // via onEditorChange → updateDescriptionControl(). Built-in validators
      // re-run after setErrors(null) and would re-invalidate the control.
      description: [''],
      imageUrl: [null, this.isEditMode ? [] : [Validators.required]],
      categoryId: ['', Validators.required],
    });
    // Start description as invalid (required) until the user types something
    this.blogForm.controls['description'].setErrors({ required: true });
  }

  onSubmit(): void {
    // Mark all as touched to surface validation errors visually
    Object.keys(this.blogForm.controls).forEach(key => {
      this.blogForm.get(key)?.markAsTouched();
    });

    // Final description check — in case user never interacted with editor
    const descValue = this.blogForm.get('description')?.value || '';
    const plainText = descValue.replace(/<[^>]*>/g, '').trim();
    if (!plainText) {
      this.blogForm.controls['description'].setErrors({ required: true });
    } else if (plainText.length < 50) {
      this.blogForm.controls['description'].setErrors({ minlength: true });
    }

    if (!this.blogForm.valid) return;
    if (!this.isEditMode && !this.selectedFileNewBlog) {
      this.blogForm.get('imageUrl')?.setErrors({ required: true });
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;

    const formData = new FormData();
    formData.append('title', this.blogForm.value.title);
    formData.append('description', this.blogForm.value.description);
    formData.append('categoryId', this.blogForm.value.categoryId);
    if (this.selectedFileNewBlog) {
      formData.append('imageUrl', this.selectedFileNewBlog, this.selectedFileNewBlog.name);
    }

    if (this.isEditMode && this.editBlog?._id) {
      // Edit: use updateBlog. Build a Blog object from form values.
      const updatedBlog: Blog = {
        ...this.editBlog,
        title: this.blogForm.value.title,
        description: this.blogForm.value.description,
        categoryId: this.blogForm.value.categoryId,
      };
      this.blogService.updateBlog(updatedBlog).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.firstStep = false;
          this.secondStep = true;
          setTimeout(() => this.router.navigate([`/blog/${response._id}`]), 2000);
        },
        error: (error) => {
          console.error('Error updating blog:', error);
          this.isSubmitting = false;
          this.submitError = 'No se pudo actualizar el blog. Inténtalo de nuevo.';
        },
      });
    } else {
      this.blogService.createBlog(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.firstStep = false;
          this.secondStep = true;
          setTimeout(() => this.router.navigate([`/blog/${response._id}`]), 2000);
        },
        error: (error) => {
          console.error('Error creating blog:', error);
          this.isSubmitting = false;
          this.submitError = 'No se pudo crear el blog. Inténtalo de nuevo.';
        },
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
    if (!this.isEditMode) this.resetForm();
  }

  onProcessDone() {
    this.closeModal();
    this.router.navigate(['/home']);
  }

  onFileSelectedNewInstructor(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files?.length) return;
    const file = target.files[0];

    if (!file.type.startsWith('image/')) {
      this.blogForm.get('imageUrl')?.setErrors({ invalidType: true });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.blogForm.get('imageUrl')?.setErrors({ maxSize: true });
      return;
    }

    this.selectedFileNewBlog = file;
    this.blogForm.patchValue({ imageUrl: file });
    this.blogForm.get('imageUrl')?.setErrors(null);

    const reader = new FileReader();
    reader.onload = (e) => { this.imagePreview = e.target?.result as string; };
    reader.readAsDataURL(file);
  }

  onDragOver(event: DragEvent) { event.preventDefault(); event.stopPropagation(); }
  onDragLeave(event: DragEvent) { event.preventDefault(); event.stopPropagation(); }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files?.[0];
    if (file?.type.startsWith('image/')) {
      this.selectedFileNewBlog = file;
      this.blogForm.patchValue({ imageUrl: file });
      const reader = new FileReader();
      reader.onload = (e) => { this.imagePreview = e.target?.result as string; };
      reader.readAsDataURL(file);
    }
  }

  clearImage() {
    this.selectedFileNewBlog = null;
    this.imagePreview = this.isEditMode ? (this.editBlog?.imageUrl ?? null) : null;
    this.blogForm.patchValue({ imageUrl: null });
    if (!this.isEditMode) {
      this.blogForm.get('imageUrl')?.setErrors({ required: true });
    }
  }

  resetForm() {
    this.blogForm.reset();
    this.selectedFileNewBlog = null;
    this.imagePreview = null;
    this.firstStep = false;
    this.secondStep = false;
    this.submitError = null;
  }

  getWordCount(): number {
    const text = (this.blogForm.get('description')?.value || '').replace(/<[^>]*>/g, '').trim();
    return text ? text.split(/\s+/).filter(Boolean).length : 0;
  }

  getCharCount(): number {
    return (this.blogForm.get('description')?.value || '').replace(/<[^>]*>/g, '').length;
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.blogForm.get(field);
    return !!(ctrl?.invalid && (ctrl.dirty || ctrl.touched));
  }

  isFieldValid(field: string): boolean {
    const ctrl = this.blogForm.get(field);
    return !!(ctrl?.valid && ctrl.touched);
  }
}