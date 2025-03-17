import { Injectable } from '@angular/core';
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';
@Injectable({
  providedIn: 'root'
})
export class FirebaseAnalyticsService {

  constructor() { }

async logEvent(eventName: string, eventParams: any) {
  console.log(`Trying to log event: ${eventName}, ${JSON.stringify(eventParams)}`);
  try {
    await FirebaseAnalytics.logEvent({
      name: eventName,
      params: eventParams || {},
    });
    console.log(`Event logged successfully: ${eventName}, ${JSON.stringify(eventParams)}`);
  } catch (error) {
    console.error('Errore nel log dell\'evento:', error);
  }
}
}
