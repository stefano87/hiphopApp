import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RatingService } from '../services/rating.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
  IonLabel, IonButton, IonIcon, IonToast,ToastController, IonButtons, IonTabButton, IonTabs, IonTabBar, IonModal, IonCardContent, IonCard } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
@Component({
   standalone: true,
    imports: [IonCard, IonCardContent, IonButtons, 
      IonIcon, 
      IonButton,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonContent,
      CommonModule
    ],
  providers: [ModalController],  
  selector: 'app-rating-popup',
  templateUrl: './rating-popup.component.html',
  styleUrls: ['./rating-popup.component.scss'],
})
export class RatingPopupComponent {

  constructor(private modalCtrl: ModalController,
    private ratingService: RatingService) { }

    async rateNow() {
      await this.ratingService.rateApp();
      this.modalCtrl.dismiss();
    }
  
    dismiss() {
      this.ratingService.dismissRating();
      this.modalCtrl.dismiss();
    }

}
