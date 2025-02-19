import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonTab } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { library, mic, musicalNotes,people } from 'ionicons/icons';
@Component({
  selector: 'app-footer-tabs',
  standalone:true,
  imports: [ IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  templateUrl: './footer-tabs.component.html',
  styleUrls: ['./footer-tabs.component.scss'],
})
export class FooterTabsComponent {

  constructor() { 
    addIcons({ musicalNotes, mic, library,people });
  }



}
