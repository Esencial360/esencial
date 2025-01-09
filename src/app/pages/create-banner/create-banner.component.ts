import { Component } from '@angular/core';
import { BannerService } from '../../shared/services/banner.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Banner } from '../../shared/Models/Banner';

@Component({
  selector: 'app-create-banner',
  templateUrl: './create-banner.component.html',
  styleUrl: './create-banner.component.css',
})
export class CreateBannerComponent {
  banners!: any;
  selectedBannerId: string = '';
  bannerForm!: FormGroup;
  creatingBanner!: boolean;
  errorCreatingBanner!: boolean;
  successCreatingBanner!: boolean;
  detailsBanner!: boolean;
  selectedBanner!: Banner

  constructor(private bannerService: BannerService, private fb: FormBuilder) {
    this.bannerForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: [
        '',
        [
          Validators.required,
          Validators.pattern(/https?:\/\/.+\.(jpg|jpeg|png|gif)$/),
        ],
      ],
      linkUrl: ['', Validators.pattern(/https?:\/\/.+/)],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      isActive: [false],
    });
  }

  ngOnInit() {
    this.loadBanners();
  }

  loadBanners() {
    this.bannerService.getAllBanners('').subscribe((response) => {
      this.banners = response;
      console.log(this.banners);
    });
  }

  loadBannerData() {
    if (this.selectedBannerId) {
      const selectedBanner = this.banners.find(
        (b: { _id: string }) => b._id === this.selectedBannerId
      );
      if (selectedBanner) {
        this.bannerForm = { ...selectedBanner };
      }
    }
  }

  onSubmit() {
    console.log(this.bannerForm);
    if (this.bannerForm.valid) {
      this.creatingBanner = true;
      this.bannerService.createBanner(this.bannerForm.value).subscribe(
        (response) => {
          console.log('Banner created:', response);
          this.creatingBanner = false;
          this.successCreatingBanner = true;
        },
        (error) => {
          console.error('Error creating banner:', error);
          this.creatingBanner = false;
          this.errorCreatingBanner = true;
        }
      );
    } else {
      console.log('Create form is not valid');
      alert('Form is not valid');
    }
  }

  onUpdate() {
    this.bannerService
      .updateBanner(this.selectedBannerId, this.bannerForm)
      .subscribe(
        (response) => {
          console.log('Banner updated:', response);
          this.loadBanners();
        },
        (error) => {
          console.error('Error updating banner:', error);
        }
      );
  }

  deactivateBanner(id: string) {
    const banner = this.banners.find((b: { _id: string }) => b._id === id);
    if (banner) {
      this.bannerService
        .updateBanner(id, { isActive: !banner.isActive })
        .subscribe(
          (response) => {
            banner.isActive = response.isActive;
            console.log('Banner status updated:', response);
          },
          (error) => console.error('Error updating banner status:', error)
        );
    }
  }

  deleteBanner(id: string) {
    this.bannerService.deleteBanner(id).subscribe(
      () => {
        this.banners = this.banners.filter(
          (b: { _id: string }) => b._id !== id
        );
        console.log('Banner deleted');
      },
      (error) => console.error('Error deleting banner:', error)
    );
  }

  openBanner(banner: Banner) {
    this.detailsBanner = true
    this.selectedBanner = banner
  }

  onBannerCreationDone() {
    console.log('Banner is created');
  }
}
