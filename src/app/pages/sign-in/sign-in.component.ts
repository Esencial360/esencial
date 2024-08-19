import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { FileUploadService } from '../../shared/services/file-upload.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  // showPassword = false;
  // signInForm: FormGroup;
  // showAlert = false;
  // selectedFile: File | null = null;

  // constructor(
  //   private fb: FormBuilder,
  //   private sanitizer: DomSanitizer,
  //   private router: Router,
  //   private authService: AuthService,
  // ) {
  //   this.signInForm = this.fb.group({
  //     email: ['', [Validators.required, Validators.email]],
  //     password: ['', Validators.required],
  //   });
  // }

  // onSubmit() {
  //   if (this.signInForm.valid) {
  //     console.log(
  //       'Form submitted with sanitized values:',
  //       this.signInForm.value.email,
  //       this.signInForm.value.password
  //     );
  //     this.showAlert = true;
  //     this.onLogin(this.signInForm.value.email, this.signInForm.value.password);
  //   } else {
  //     this.showAlert = false;
  //   }
  // }

  // togglePasswordVisibility() {
  //   this.showPassword = !this.showPassword;
  // }

  // navigateToSignup() {
  //   this.router
  //     .navigateByUrl('/subscribirse')
  //     .then((navigationSuccess) => {
  //       if (navigationSuccess) {
  //         console.log('Navigation to subscribirse page successful');
  //       } else {
  //         console.error('Navigation to subscribirse page failed');
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(`An error occurred during navigation: ${error.message}`);
  //     });
  // }

  // navigateToForgot() {
  //   this.router
  //     .navigateByUrl('/olvido')
  //     .then((navigationSuccess) => {
  //       if (navigationSuccess) {
  //         console.log('Navigation to olvido page successful');
  //       } else {
  //         console.error('Navigation to olvido page failed');
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(`An error occurred during navigation: ${error.message}`);
  //     });
  // }

  // onLogin(username: string, password: string) {
  //   this.authService.login(username, password).subscribe(
  //     (response: any) => {
  //       console.log(response);
  //       if (response.body.accessToken) {
  //         console.log('Login successful');
  //         this.showAlert = false;
  //         localStorage.setItem('accessToken', response.body.accessToken);
  //         localStorage.setItem('roles', response.body.roles);
  //         this.router.navigate(['/dashboard']);
  //       } else {
  //         console.log('Login failed');
  //         this.showAlert = true;
  //       }
  //     },
  //     (error) => {
  //       // Handle login error
  //       console.error('Login error:', error);
  //       this.showAlert = true;
  //     }
  //   );
  // }
}
