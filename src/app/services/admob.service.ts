import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AdMob, BannerAdOptions, BannerAdPosition, BannerAdSize, AdLoadInfo } from '@capacitor-community/admob';

@Injectable({
  providedIn: 'root'
})
export class AdMobService {
  private isInitialized = false;
  
  private readonly bannerAdId = {
    android: 'ca-app-pub-5162875721816233/4852911129',
  };

  private readonly interstitialAdId = {
    android: 'ca-app-pub-5162875721816233/9130233335',
  };

  constructor(private platform: Platform) {}

  async initialize() {
    try {
      await this.platform.ready();
      
      if (!this.isInitialized) {
        await AdMob.initialize({
          testingDevices: [],
          initializeForTesting: false
        });
        

        
        this.isInitialized = true;
        console.log('AdMob inizializzato con successo');
      }
    } catch (error) {
      console.error('Errore durante l\'inizializzazione di AdMob:', error);
      this.isInitialized = false;
    }
  }

  async showBanner() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const options: BannerAdOptions = {
        adId: this.bannerAdId.android,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: false
      };

      await AdMob.showBanner(options);
    } catch (error) {
      console.error('Errore nel mostrare il banner:', error);
    }
  }

  async hideBanner() {
    try {
      if (this.isInitialized) {
        await AdMob.removeBanner();
      }
    } catch (error) {
      console.error('Errore nel nascondere il banner:', error);
    }
  }

  async prepareInterstitial() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      await AdMob.prepareInterstitial({
        adId: this.interstitialAdId.android,
        isTesting: false
      });
    } catch (error) {
      console.error('Errore nella preparazione dell\'interstitial:', error);
    }
  }

  async showInterstitial() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      await this.prepareInterstitial();
      await AdMob.showInterstitial();
    } catch (error) {
      console.error('Errore nel mostrare l\'interstitial:', error);
    }
  }
}