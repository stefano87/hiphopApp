import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import emailjs from '@emailjs/browser';
import { importProvidersFrom } from '@angular/core';
import { AdMobService } from './app/services/admob.service';
import { addIcons } from 'ionicons';
import { rocketOutline, speedometerOutline, peopleOutline,codeSlashOutline,closeOutline } from 'ionicons/icons';

// Registra le icone mancanti
addIcons({
  'rocket-outline': rocketOutline,
  'speedometer-outline': speedometerOutline,
  'people-outline': peopleOutline,
  'code-slash-outline': codeSlashOutline,
  'close-outline': closeOutline
});

emailjs.init("wGIIne2OHbReiZb6E");

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    importProvidersFrom(HttpClientModule),  // Add this
    provideRouter(routes, withPreloading(PreloadAllModules)),
    AdMobService
  ],
});
