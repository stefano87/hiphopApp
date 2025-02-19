import { Component, OnInit,OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModalController, IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
         IonLabel, 
         IonButton, 
         IonIcon, 
         IonToast,
         ToastController,
         IonCard,
         IonCardContent,
         IonInput,
         IonTextarea,
         IonCheckbox, IonButtons,IonModal } from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';         
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import emailjs from '@emailjs/browser';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { AdMobService } from '../services/admob.service';
@Component({
  selector: 'app-community',
  standalone: true,
  imports: [IonModal,IonButtons, 
    IonCardContent, 
    IonCard, 
    CommonModule,
    HttpClientModule,  // Add this
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
export class CommunityComponent  implements OnInit {

  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private adMobService: AdMobService,
    private toastController: ToastController,
    private modalCtrl: ModalController,
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      message: ['', Validators.required],
      privacy: [false, Validators.requiredTrue]
    });
  }

  async ngOnInit() {
    try {
      await this.adMobService.showInterstitial();
    } catch (error) {
      console.error('Errore durante la visualizzazione dell\'interstitial:', error);
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
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;

      // Email configuration using EmailJS
      const templateParams = {
        from_name: formData.name,
        message: formData.message,
        reply_to: formData.email 
      };

      try {
        // You'll need to replace these with your actual EmailJS credentials
        await emailjs.send(
          'service_56y1eua',
          'template_ngd0i3o',
          templateParams,
          'wGIIne2OHbReiZb6E'
        );

        const toast = await this.toastController.create({
          message: 'Message sent successfully!',
          duration: 2000,
          color: 'success'
        });
        toast.present();

        this.contactForm.reset();
      } catch (error) {
        const toast = await this.toastController.create({
          message: 'Error sending message. Please try again.',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
        console.error('Error:', error);
      }
    }
  }


}
