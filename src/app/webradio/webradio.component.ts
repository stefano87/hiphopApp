import { Component, OnInit, OnDestroy } from '@angular/core';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ModalController,IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
  IonLabel, IonButton, IonIcon, IonToast,ToastController,IonThumbnail, IonButtons, IonTabButton, IonTabs, IonTabBar, IonModal, IonProgressBar, IonRange } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { 
  playOutline, 
  pauseOutline, 
  micOutline, 
  stopOutline, 
  saveOutline, 
  musicalNotesOutline,
  radioOutline,
  heart,
  heartOutline, folderOpenOutline, micCircleOutline, closeCircleOutline, timeOutline, informationCircleOutline, people, 
  musicalNotes,
  mic, 
  playSkipBackOutline,
  playSkipForwardOutline} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AdMobService } from '../services/admob.service';
import { StatusBar, Style } from '@capacitor/status-bar';
import { FirebaseAnalyticsService } from '../services/firebase-analytics.service';
interface RadioStation {
  id: number;
  name: string;
  description: string;
  genre: string;
  url: string;
  artwork: string;
}

@Component({
  selector: 'app-webradio',
    standalone: true,
    imports: [IonRange, IonButtons, IonThumbnail,
      IonIcon, 
      IonButton,
      IonLabel,
      IonItem,
      IonList,
      IonHeader,
      IonToolbar,
      IonContent,
      FormsModule,
      CommonModule,
    ],
    providers: [
      ModalController,
      IonicModule
    ],
  templateUrl: './webradio.component.html',
  styleUrls: ['./webradio.component.scss'],
})
export class WebradioComponent  implements OnInit, OnDestroy {
  icons = {
    play: playOutline,
    pause: pauseOutline,
    mic: micOutline,
    stop: stopOutline,
    save: saveOutline,
    notes: musicalNotesOutline,
    radio: radioOutline,
    heart: heartOutline,
    playskip:playSkipBackOutline,
    playforward:playSkipForwardOutline,
  };
  audioPlayer: HTMLAudioElement;
  
  stations: RadioStation[] = [
    {
      id: 1,
      name: 'Hot 97',
      description: 'New York\'s #1 for Hip Hop and R&B',
      genre: 'Hip Hop / R&B',
      url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/WQHTFM.mp3',
      artwork: '../../assets/stations/hot97.png'
    },
    {
      id: 2,
      name: 'HOT 108 JAMZ',
      description: 'The #1 Internet Hip Hop Radio Station',
      genre: 'Hip Hop / Urban',
      url: 'https://live.streamthe.world/hot108',
      artwork: '../../assets/stations/hot108.png'
    },
    {
      id: 3,
      name: 'Flow 103',
      description: 'Old school hip hop and golden era classics',
      genre: 'Hip Hop/R&B',
      url: 'https://ais-sa3.cdnstream1.com/1668_128',
      artwork: '../../assets/stations/flow-103.jpg'
    },
    {
      id: 4,
      name: 'WHAT?! Radio',
      description: 'Classic Hip Hop',
      genre: 'Classic Hip Hop',
      url: 'http://162.144.106.6:9119/stream?type=http&nocache=224109',
      artwork: '../../assets/stations/what.jpeg'
    },
    {
      id: 5,
      name: 'Hip Hop Lounge',
      description: 'Chill hip hop and lofi beats',
      genre: 'Lofi Hip Hop',
      url: 'https://stream.laut.fm/lofi',
      artwork: '../../assets/stations/lounge.jpeg'
    },
    {
      id: 6,
      name: 'DTLR Radio',
      description: 'Hip Hop and R&B from the 90s and 2000s',
      genre: 'Hip Hop',
      url: 'http://108.178.13.122:8195/stream?type=http&nocache=18421',
      artwork: '../../assets/stations/dtlr.webp'
    },
    {
      id: 7,
      "name": "100 Hip Hop and RNB FM",
      "description": "24/7 Hip Hop and R&B hits",
      "genre": "Hip Hop/R&B",
      "url": "http://192.99.41.102:5036/stream?type=http&nocache=120614",
      "artwork": "../../assets/stations/logo-lftm-400px.png"
    },
    {
      id: 8,
      name: 'Trap City Radio',
      description: 'Latest trap and modern hip hop',
      genre: 'Trap / Modern Hip Hop',
      url: 'http://stream.zeno.fm/0r0xa792kwzuv',
      artwork: '../../assets/stations/trapcity.jpeg'
    }
  ];

  currentStationIndex: number | null = null;
  currentStation: RadioStation | null = null;
  isPlaying: boolean = false;
  volume: number = 0.7;
  private adInterval: any;
  private readonly AD_DISPLAY_INTERVAL = 180000;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private adMobService: AdMobService,
    private FirebaseAnalytics: FirebaseAnalyticsService) {
    this.audioPlayer = new Audio();
    addIcons({playSkipForwardOutline,playSkipBackOutline,micCircleOutline,informationCircleOutline,musicalNotes,mic,people,radioOutline,stopOutline,closeCircleOutline,musicalNotesOutline,timeOutline,saveOutline,folderOpenOutline,playOutline,pauseOutline,heart,heartOutline});
  }

  async ngOnInit() {
    await this.FirebaseAnalytics.logEvent('page_view', { page: 'radio' });
    // Imposta il testo della barra di stato a bianco (per sfondi scuri)
    await StatusBar.setStyle({ style: Style.Dark	 });
        
    // Imposta il colore di sfondo della barra di stato
    await StatusBar.setBackgroundColor({ color: '#282828' });
    // Configurazione iniziale del player audio
    this.audioPlayer.volume = this.volume;
    
    // Event listeners
    this.audioPlayer.addEventListener('play', () => {
      this.isPlaying = true;
    });
    
    this.audioPlayer.addEventListener('pause', () => {
      this.isPlaying = false;
    });
    
    this.audioPlayer.addEventListener('error', (error) => {
      this.showToast('Error while playing. Please try again later.', 'danger');
      this.isPlaying = false;
    });
    
    this.startAdTimer();
  }
  private startAdTimer() {
    // Pulisci qualsiasi timer esistente prima di crearne uno nuovo
    this.clearAdTimer();
    
    // Crea un nuovo timer che mostra un annuncio ogni 3 minuti
    this.adInterval = setInterval(() => {
      // Usa una funzione asincrona immediata (IIFE) all'interno del setInterval
      (async () => {
        try {
          // Salva lo stato di riproduzione corrente
          const wasPlaying = this.isPlaying;
          
          // Metti in pausa la radio se è in riproduzione
          if (wasPlaying) {
            this.audioPlayer.pause();
          }
          
          // Mostra l'annuncio interstiziale
          await this.adMobService.showInterstitial();
          
          // Riprendi la riproduzione se era attiva prima dell'annuncio
          if (wasPlaying) {

            this.audioPlayer.play().catch(error => {
              this.showToast(`Impossibile riprendere la riproduzione. Riprova.`, 'danger');
            });
          }
        } catch (error) {
          console.error('Errore durante la visualizzazione dell\'annuncio:', error);
        }
      })();
    }, this.AD_DISPLAY_INTERVAL);
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
  
    await toast.present();
  }

  ngOnDestroy() {
    // Ferma la riproduzione e pulisci le risorse quando il componente viene distrutto
    this.audioPlayer.pause();
    this.audioPlayer.src = '';
    this.audioPlayer.load();
    this.clearAdTimer();
  }
   // Metodo per pulire il timer degli annunci
  private clearAdTimer() {
    if (this.adInterval) {
      clearInterval(this.adInterval);
      this.adInterval = null;
    }
  }

  async openInfoModal() {
    const modal = await this.modalController.create({
      component: InfoModalComponent,
      cssClass: 'info-modal'
    });
    return await modal.present();
  }

  selectStation(index: number) {
    // Se è la stessa stazione, toggle play/pause
    if (this.currentStationIndex === index) {
      this.togglePlay();
      return;
    }

    // Cambia stazione
    this.currentStationIndex = index;
    this.currentStation = this.stations[index];
    
    // Ferma la riproduzione corrente
    this.audioPlayer.pause();
    this.audioPlayer.src = '';
    
    // Imposta e avvia la nuova stazione
    this.audioPlayer.src = this.currentStation.url;
    this.audioPlayer.load();
    this.audioPlayer.play().catch(error => {
      this.showToast(`Unable to play  ${this.currentStation?.name}. Please try again later.`, 'danger');
    });
  }

  togglePlay() {
    if (!this.currentStation) {
      // Se nessuna stazione è selezionata, seleziona la prima
      if (this.stations.length > 0) {
        this.selectStation(0);
      }
      return;
    }

    if (this.isPlaying) {
      this.audioPlayer.pause();
    } else {
      this.audioPlayer.play().catch(error => {
        this.showToast(`Unable to play ${this.currentStation?.name}. Please try again later.`, 'danger');
      });
    }
  }

  previousStation() {
    if (this.currentStationIndex === null) return;
    
    const prevIndex = this.currentStationIndex <= 0 ? 
      this.stations.length - 1 : 
      this.currentStationIndex - 1;
    
    this.selectStation(prevIndex);
  }

  nextStation() {
    if (this.currentStationIndex === null) return;
    
    const nextIndex = this.currentStationIndex >= this.stations.length - 1 ? 
      0 : 
      this.currentStationIndex + 1;
    
    this.selectStation(nextIndex);
  }

  adjustVolume() {
    this.audioPlayer.volume = this.volume;
  }
}

