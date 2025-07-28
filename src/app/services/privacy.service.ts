import { Injectable } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { LicenseDialogComponent } from '../license-dialog/license-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class PrivacyService {

  constructor(
    private modalController: ModalController,
    private alertController: AlertController
  ) { }

  // Check if user has accepted Pixabay license
  async hasAcceptedLicense(): Promise<boolean> {
    const result = await Preferences.get({ key: 'pixabay_license_accepted' });
    return result.value === 'true';
  }

  // Show license dialog
  async showLicenseDialog(): Promise<boolean> {
    const modal = await this.modalController.create({
      component: LicenseDialogComponent,
      backdropDismiss: false,
      cssClass: 'license-modal'
    });

    await modal.present();
    
    const { data } = await modal.onWillDismiss();
    
    return data?.accepted || false;
  }

  // Initialize privacy checks (call this in app.component.ts)
  async initializePrivacyChecks(): Promise<boolean> {
    try {
      // First check license - loop until accepted
      if (!(await this.hasAcceptedLicense())) {
        while (true) {
          const licenseAccepted = await this.showLicenseDialog();
          if (licenseAccepted) {
            break;
          }
          // Continue loop until user accepts
        }
      }

      // Then check privacy policy - loop until accepted
      if (!(await this.hasAcceptedPrivacyPolicy())) {
        while (true) {
          const privacyAccepted = await this.showPrivacyBanner();
          if (privacyAccepted) {
            break;
          }
          // Continue loop until user accepts
        }
      }

      return true;
    } catch (error) {
      console.error('Error in privacy checks:', error);
      return false;
    }
  }

  // Check if user has accepted privacy policy
  async hasAcceptedPrivacyPolicy(): Promise<boolean> {
    const result = await Preferences.get({ key: 'privacy_policy_accepted' });
    return result.value === 'true';
  }

  // Show GDPR compliant privacy policy banner
  async showPrivacyBanner(): Promise<boolean> {
    const alert = await this.alertController.create({
      header: 'Privacy & Cookie Policy',
      message: 'We care about your privacy. This app uses AdMob for advertisements and Firebase Analytics for app improvement. We collect anonymous usage data and device information for ads, but we do NOT collect personal information or voice recordings (stored locally only). By continuing, you consent to our privacy practices and the use of cookies for advertising purposes.',
      buttons: [
        {
          text: 'Accept All',
          handler: async () => {
            await this.savePrivacyConsent(true, true);
            return true;
          }
        },
        {
          text: 'Manage Preferences',
          handler: async () => {
            await this.showDetailedPrivacyOptions();
            return false; // Non chiudere l'alert principale
          }
        }
      ],
      backdropDismiss: false,
      cssClass: 'privacy-alert'
    });

    await alert.present();
    
    const { data } = await alert.onDidDismiss();
    
    // Controlla se l'utente ha effettivamente accettato
    const hasAccepted = await this.hasAcceptedPrivacyPolicy();
    return hasAccepted;
  }

  // Show detailed privacy options (GDPR compliant)
  private async showDetailedPrivacyOptions(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Privacy Preferences',
      message: 'Choose your privacy preferences. Necessary cookies are required for the app to function.',
      inputs: [
        {
          name: 'necessary',
          type: 'checkbox',
          label: 'Necessary cookies (Required for app functionality)',
          value: 'necessary',
          checked: true,
          disabled: true
        },
        {
          name: 'analytics',
          type: 'checkbox',
          label: 'Analytics - Firebase Analytics (Help us improve the app)',
          value: 'analytics',
          checked: true
        },
        {
          name: 'advertising',
          type: 'checkbox',
          label: 'Advertising - AdMob (Show personalized ads)',
          value: 'advertising',
          checked: true
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // Torna al banner principale
            setTimeout(() => this.showPrivacyBanner(), 100);
          }
        },
        {
          text: 'Save Preferences',
          handler: async (data) => {
            const analyticsConsent = data.includes('analytics');
            const advertisingConsent = data.includes('advertising');
            
            await this.savePrivacyConsent(analyticsConsent, advertisingConsent);
            
            // Mostra conferma
            await this.showConsentConfirmation(analyticsConsent, advertisingConsent);
          }
        }
      ],
      backdropDismiss: false
    });

    await alert.present();
  }

  // Save privacy consent with granular options
  private async savePrivacyConsent(analytics: boolean, advertising: boolean): Promise<void> {
    const consentData = {
      analytics: analytics,
      advertising: advertising,
      necessary: true, // Sempre true
      timestamp: new Date().toISOString(),
      version: '1.0'
    };

    await Preferences.set({
      key: 'privacy_policy_accepted',
      value: 'true'
    });

    await Preferences.set({
      key: 'privacy_consent_details',
      value: JSON.stringify(consentData)
    });

    await Preferences.set({
      key: 'privacy_acceptance_date',
      value: new Date().toISOString()
    });
  }

  // Show consent confirmation
  private async showConsentConfirmation(analytics: boolean, advertising: boolean): Promise<void> {
    let message = 'Your privacy preferences have been saved successfully.\n\n';
    message += `• Analytics: ${analytics ? 'Enabled' : 'Disabled'}\n`;
    message += `• Advertising: ${advertising ? 'Enabled' : 'Disabled'}\n`;
    message += `• Necessary: Enabled (Required)\n\n`;
    message += 'You can change these preferences at any time in the app settings.';

    const alert = await this.alertController.create({
      header: 'Preferences Saved',
      message: message,
      buttons: [
        {
          text: 'Continue',
          handler: () => {
            // Conferma che tutto è stato salvato
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  // Get user consent details
  async getConsentDetails(): Promise<any> {
    const result = await Preferences.get({ key: 'privacy_consent_details' });
    return result.value ? JSON.parse(result.value) : null;
  }

  // Method to show privacy settings (to be called from app settings)
  async showPrivacySettings(): Promise<void> {
    const currentConsent = await this.getConsentDetails();
    
    if (!currentConsent) {
      await this.showPrivacyBanner();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Privacy Settings',
      message: 'Manage your privacy preferences:',
      inputs: [
        {
          name: 'necessary',
          type: 'checkbox',
          label: 'Necessary cookies (Required)',
          value: 'necessary',
          checked: true,
          disabled: true
        },
        {
          name: 'analytics',
          type: 'checkbox',
          label: 'Analytics (Firebase Analytics)',
          value: 'analytics',
          checked: currentConsent.analytics
        },
        {
          name: 'advertising',
          type: 'checkbox',
          label: 'Advertising (AdMob)',
          value: 'advertising',
          checked: currentConsent.advertising
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save Changes',
          handler: async (data) => {
            const analyticsConsent = data.includes('analytics');
            const advertisingConsent = data.includes('advertising');
            
            await this.savePrivacyConsent(analyticsConsent, advertisingConsent);
            await this.showConsentConfirmation(analyticsConsent, advertisingConsent);
          }
        }
      ]
    });

    await alert.present();
  }

  // Method to revoke consent (for GDPR compliance)
  async revokeConsent(): Promise<void> {
    await Preferences.remove({ key: 'privacy_policy_accepted' });
    await Preferences.remove({ key: 'privacy_consent_details' });
    await Preferences.remove({ key: 'privacy_acceptance_date' });
  }
}