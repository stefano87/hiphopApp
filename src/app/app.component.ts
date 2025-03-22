import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { IonApp, IonRouterOutlet,Platform, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonTab, IonHeader, IonToolbar, IonButtons, IonButton, IonContent } from '@ionic/angular/standalone';
import { BeatListComponent } from "./beat-list/beat-list.component";
import { FooterTabsComponent } from './footer-tabs/footer-tabs.component';
import { AdMobService } from './services/admob.service'
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonContent, IonButton, IonButtons, IonToolbar, IonHeader,  IonApp, IonRouterOutlet,FooterTabsComponent],
})
export class AppComponent implements OnInit, OnDestroy{
  constructor( private platform: Platform,
    private adMobService: AdMobService) {
      this.initializeApp();
  }
  async initializeApp() {
    try {
      // Aspetta che la piattaforma sia pronta
      await this.platform.ready();
      
        // Imposta il testo della barra di stato a bianco (per sfondi scuri)
        await StatusBar.setStyle({ style: Style.Dark });
        
        // Imposta il colore di sfondo della barra di stato
        await StatusBar.setBackgroundColor({ color: '#282828' });
      
    } catch (error) {
      console.error('Errore nell\'inizializzazione della barra di stato:', error);
    }
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
