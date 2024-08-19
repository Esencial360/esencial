import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { FileUploadService } from '../../shared/services/file-upload.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  // signInForm: FormGroup;
  // firstStep!: boolean;
  // secondStep!: boolean;
  // thirdStep!: boolean;
  // showAlert!: boolean;
  // selectedPlan: 'freemium' | 'premium' | 'pro' = 'freemium';
  // promoCode: string = '';
  // selectedFile: File | null = null;

  // constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,  private fileUploadService: FileUploadService) {
  //   this.signInForm = this.fb.group({
  //     firstname: ['', [Validators.required]],
  //     lastname: ['', Validators.required],
  //     email: ['', [Validators.required, Validators.email]],
  //     password: ['', Validators.required],
  //   });
  // }

  // ngOnInit(): void {
  //   this.firstStep = true;
  // }

  // // onSubmit() {
  // //   if (this.signInForm.valid) {
  // //     console.log('Form submitted with sanitized values:', this.signInForm);
  // //     this.onRegisterUser(
  // //       this.signInForm.value.email,
  // //       this.signInForm.value.firstname,
  // //       this.signInForm.value.lastname,
  // //       this.signInForm.value.password
  // //     );
  // //   }
  // // }

  // onPlanChange(plan: 'freemium' | 'premium' | 'pro') {
  //   this.selectedPlan = plan;
  //   console.log(this.selectedPlan);
  // }

  // onPromoCodeChange(promoCode: any) {
  //   this.promoCode = promoCode;
  //   console.log(this.promoCode);
  // }

  // // onChoosePlan() {
  // // }

  // onRegisterUser(
  //   email: string,
  //   firstname: string,
  //   lastname: string,
  //   password: string
  // ) {
  //   this.authService
  //     .registerUser(email, firstname, lastname, password)
  //     .subscribe(
  //       (response: any) => {
  //         if (response.body.success) {
  //           console.log('Login successful');
  //           this.showAlert = false;
  //           // this.router.navigate(['/dashboard']);
  //           this.firstStep = false;
  //           this.secondStep = true;
  //         } else {
  //           console.log('Login failed');
  //           this.showAlert = true;
  //         }
  //       },
  //       (error) => {
  //         // Handle login error
  //         console.error('Login error:', error);
  //         this.showAlert = true;
  //       }
  //     );
  // }

  // onPlanSelected() {
  //   this.router.navigate(['/dashboard'])
  // }

  // onFileSelected(event: any) {
  //   this.selectedFile = event.target.files[0];
  // }

  
  // onFileSubmit() {
  //   if (this.selectedFile) {
  //     this.fileUploadService.uploadFile(this.selectedFile).subscribe(
  //       (response) => {
  //         console.log('File uploaded successfully:', response);
  //         // Handle the response from the server
  //       },
  //       (error) => {
  //         console.error('Error uploading file:', error);
  //         // Handle the error
  //       }
  //     );
  //   }
  // }
}
