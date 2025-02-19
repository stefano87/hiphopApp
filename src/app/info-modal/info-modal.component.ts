import { Component, OnInit } from '@angular/core';
import { ModalController, IonContent,
  IonButton, IonIcon,IonCard,IonCardContent, IonButtons } from '@ionic/angular/standalone';
@Component({
  standalone:true,
  imports: [
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent
  ],
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
})
export class InfoModalComponent {

  constructor(private modalCtrl: ModalController) { }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

}
