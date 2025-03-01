// community.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  ToastController,
  IonCard,
  IonCardContent,
  IonInput,
  IonTextarea,
  IonCheckbox,
  IonButtons,
  IonModal
} from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import emailjs from '@emailjs/browser';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { AdMobService } from '../services/admob.service';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [
    IonModal,
    IonButtons,
    IonCardContent,
    IonCard,
    CommonModule,
    HttpClientModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    ReactiveFormsModule,
    FormsModule,
    IonInput,
    IonTextarea,
    IonCheckbox
  ],
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
})
export class CommunityComponent implements OnInit {
  songSubmissionForm: FormGroup;
  selectedFile: File | null = null;
  fileError: string | null = null;
  readonly MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private adMobService: AdMobService,
    private toastController: ToastController,
    private modalCtrl: ModalController,
  ) {
    this.songSubmissionForm = this.fb.group({
      artistName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      songTitle: ['', Validators.required],
      description: ['', Validators.required],
      privacy: [false, Validators.requiredTrue]
    });
  }

  async ngOnInit() {
    try {
      await this.adMobService.showInterstitial();
    } catch (error) {
      console.error('Error showing interstitial:', error);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.fileError = null;

    if (file) {
      if (file.size > this.MAX_FILE_SIZE) {
        this.fileError = 'File size exceeds 3MB limit';
        this.selectedFile = null;
        return;
      }

      if (!file.type.startsWith('audio/')) {
        this.fileError = 'Please upload an audio file';
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
    }
  }

  async openInfoModal() {
    const modal = await this.modalCtrl.create({
      component: InfoModalComponent,
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      cssClass: 'info-modal'
    });
    await modal.present();
  }

  async onSubmit() {
    if (this.songSubmissionForm.valid && this.selectedFile && !this.fileError) {
      const formData = new FormData();
      formData.append('artistName', this.songSubmissionForm.get('artistName')?.value);
      formData.append('email', this.songSubmissionForm.get('email')?.value);
      formData.append('songTitle', this.songSubmissionForm.get('songTitle')?.value);
      formData.append('description', this.songSubmissionForm.get('description')?.value);
      formData.append('songFile', this.selectedFile);

      // Email configuration using EmailJS
      const templateParams = {
        from_name: this.songSubmissionForm.get('artistName')?.value,
        song_title: this.songSubmissionForm.get('songTitle')?.value,
        description: this.songSubmissionForm.get('description')?.value,
        reply_to: this.songSubmissionForm.get('email')?.value
      };

      try {
        // Send email notification
        await emailjs.send(
          'service_56y1eua',
          'template_ngd0i3o',
          templateParams,
          'wGIIne2OHbReiZb6E'
        );

        // Show success message
        const toast = await this.toastController.create({
          message: 'Song submitted successfully! We will review your submission.',
          duration: 3000,
          color: 'success'
        });
        toast.present();

        // Reset form
        this.songSubmissionForm.reset();
        this.selectedFile = null;
      } catch (error) {
        const toast = await this.toastController.create({
          message: 'Error submitting song. Please try again.',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
        console.error('Error:', error);
      }
    }
  }
}