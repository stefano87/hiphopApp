import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { IonApp, IonRouterOutlet,Platform, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonTab } from '@ionic/angular/standalone';
import { BeatListComponent } from "./beat-list/beat-list.component";
import { FooterTabsComponent } from './footer-tabs/footer-tabs.component';
import { AdMobService } from './services/admob.service'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [ IonApp, IonRouterOutlet,FooterTabsComponent],
})
export class AppComponent implements OnInit, OnDestroy{
  constructor( private platform: Platform,
    private adMobService: AdMobService) {
  }
  async ngOnInit() {
 
    try {
      // Aspetta che la piattaforma sia pronta
      await this.platform.ready();
      
      // Inizializza AdMob
      await this.adMobService.initialize();
      
      // Mostra il banner
      await this.adMobService.showBanner();
    } catch (error) {
      console.error('Errore nell\'inizializzazione dell\'app:', error);
    }
  }
  ngOnDestroy() {
    // Rimuovi il banner quando l'app viene chiusa
    this.adMobService.hideBanner();
  }
}
