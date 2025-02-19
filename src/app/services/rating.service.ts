import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private readonly RATING_KEY = 'app_rating_status';
  private readonly LAST_PROMPT_DATE = 'last_rating_prompt';
  private readonly PROMPT_INTERVAL = 10 * 24 * 60 * 60 * 1000; // 10 giorni in millisecondi

  constructor(private platform: Platform) {}

  async shouldShowRatingPrompt(): Promise<boolean> {
    const status = localStorage.getItem(this.RATING_KEY);
    
    // Se l'utente ha già lasciato una recensione, non mostrare più
    if (status === 'rated') {
      return false;
    }

    // Se l'utente ha chiuso con X
    if (status === 'dismissed') {
      const lastPromptDate = localStorage.getItem(this.LAST_PROMPT_DATE);
      if (lastPromptDate) {
        const nextPromptDate = new Date(parseInt(lastPromptDate, 10)).getTime() + this.PROMPT_INTERVAL;
        if (Date.now() < nextPromptDate) {
          return false;
        }
      }
    }

    // Prima volta o tempo trascorso dall'ultimo prompt
    return true;
  }

  rateApp(): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            localStorage.setItem(this.RATING_KEY, 'rated');
            
            if (this.platform.is('android')) {
                window.open('market://details?id=hip_hop_beats_instrumental.dev127586.app689033', '_system');
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

  dismissRating() {
    localStorage.setItem(this.RATING_KEY, 'dismissed');
    localStorage.setItem(this.LAST_PROMPT_DATE, Date.now().toString());
  }

}
