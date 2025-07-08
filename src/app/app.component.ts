import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { IonApp, IonRouterOutlet,Platform, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonTab, IonHeader, IonToolbar, IonButtons, IonButton, IonContent } from '@ionic/angular/standalone';
import { BeatListComponent } from "./beat-list/beat-list.component";
import { FooterTabsComponent } from './footer-tabs/footer-tabs.component';
import { AdMobService } from './services/admob.service'
import { StatusBar, Style } from '@capacitor/status-bar';
import { PrivacyService } from './services/privacy.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonContent, 
    IonButton, 
    IonButtons, 
    IonToolbar, 
    IonHeader, 
    IonApp, 
    IonRouterOutlet,
    FooterTabsComponent
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  private isAppInitialized = false;

  constructor(
    private platform: Platform,
    private adMobService: AdMobService,
    private privacyService: PrivacyService
  ) {
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

      // Gestisci il pulsante back hardware di Android

    } catch (error) {
      console.error('Errore nell\'inizializzazione della barra di stato:', error);
    }
  }

  async ngOnInit() {
    try {
      // Aspetta che la piattaforma sia pronta
      await this.platform.ready();

      // Prima controlla e mostra i banner di privacy e licenza
      // Questo metodo aspetterà finché l'utente non accetta tutto
      await this.privacyService.initializePrivacyChecks();

      // Una volta accettati i termini, inizializza AdMob
      await this.initializeAdMob();
      
      this.isAppInitialized = true;
      console.log('App inizializzata correttamente');

    } catch (error) {
      console.error('Errore nell\'inizializzazione dell\'app:', error);
    }
  }

  private async initializeAdMob() {
    try {
      // Inizializza AdMob
      await this.adMobService.initialize();

      // Mostra il banner
      await this.adMobService.showBanner();
      
      console.log('AdMob inizializzato correttamente');
    } catch (error) {
      console.error('Errore nell\'inizializzazione di AdMob:', error);
    }
  }


  ngOnDestroy() {
    // Rimuovi il banner quando l'app viene chiusa
    if (this.isAppInitialized) {
      this.adMobService.hideBanner();
    }
  }
}