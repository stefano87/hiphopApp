import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, 
  IonButton, IonIcon, ModalController, AlertController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { informationCircle } from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-license-dialog',
  templateUrl: './license-dialog.component.html',
  styleUrls: ['./license-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, 
    IonButton, IonIcon
  ]
})
export class LicenseDialogComponent  implements OnInit {

  constructor(private modalController: ModalController,
    private alertController: AlertController) {
      addIcons({informationCircle}); }

  ngOnInit() {}

   async accept() {
    // Save acceptance to local storage
    await Preferences.set({
      key: 'pixabay_license_accepted',
      value: 'true'
    });
    
    await Preferences.set({
      key: 'license_acceptance_date',
      value: new Date().toISOString()
    });
    
    // Close modal with accepted result
    this.modalController.dismiss({
      accepted: true
    });
  }

}
