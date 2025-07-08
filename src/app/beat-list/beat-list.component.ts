import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalController,IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
         IonLabel, IonButton, IonIcon, IonToast,ToastController, IonButtons, IonTabButton, IonTabs, IonTabBar, IonModal, IonProgressBar } from '@ionic/angular/standalone';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { RatingService } from '../services/rating.service';
import { RatingPopupComponent } from '../rating-popup/rating-popup.component';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capawesome-team/capacitor-file-opener';
import { SplashScreen } from '@capacitor/splash-screen';
import { Preferences } from '@capacitor/preferences';
import { AdMobService } from '../services/admob.service';
import { StatusBar, Style } from '@capacitor/status-bar';
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
  mic } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Capacitor } from '@capacitor/core';
import { FavoritesService } from '../favorites.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { FirebaseAnalyticsService } from '../services/firebase-analytics.service';

interface Beat {
  id: number;
  name: string;
  url: string;
  isPlaying?: boolean;
  isRecording: boolean;
}

@Component({
  selector: 'app-beat-list',
  standalone: true,
  imports: [IonProgressBar, IonModal, IonTabBar, IonTabs, IonTabButton, IonButtons, 
    IonIcon, 
    IonButton,
    IonLabel,
    IonItem,
    IonList,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonToast,
    CommonModule,
    RatingPopupComponent
  ],
  providers: [
    ModalController,
    RatingService
  ],
  templateUrl: './beat-list.component.html',
  styleUrls: ['./beat-list.component.scss'],
})
export class BeatListComponent implements OnInit, OnDestroy {
   // Aggiungi questa proprietà per rendere le icone disponibili nel template
   icons = {
    play: playOutline,
    pause: pauseOutline,
    mic: micOutline,
    stop: stopOutline,
    save: saveOutline,
    notes: musicalNotesOutline,
    radio: radioOutline,
    heart: heartOutline
  };

 beats: Beat[] = [];

  @ViewChild(IonModal) modal?: IonModal;
  selectedBeat: Beat | null = null;
  currentAudioElement: HTMLAudioElement | null = null;
  isRecording: boolean = false;
  recordingData: any = null;
  recordingFilePath: string | null = null; // Modificato: percorso del file invece di Base64
  playRecordedAudio: boolean = false;
  isRecordingDownloaded: boolean = false;
  showCountdown: boolean = false;
  countdownNumber: number = 3;
  private countdownInterval: any;
  audioPlayer: HTMLAudioElement | null = null;
  recordingTime: number = 0;
  recordingInterval: any = null;
  recordedDuration: string = '';
  favorites: Beat[] = [];
  savedFilePath: string = '';
  currentFileName: string = '';
maxRecordingTime: number = 240; // Massimo 4 minuti di registrazione
// Aggiungi una variabile per calcolare il tempo rimanente
remainingTime: number = 240;
  constructor(
    private toastController: ToastController,
    private favoritesService: FavoritesService,
    private adMobService: AdMobService,
    private modalCtrl: ModalController,
    private ratingService: RatingService,
  private FirebaseAnalytics: FirebaseAnalyticsService) {
    // Registra le icone
    addIcons({micCircleOutline,informationCircleOutline,musicalNotes,mic,people,radioOutline,stopOutline,closeCircleOutline,musicalNotesOutline,timeOutline,saveOutline,folderOpenOutline,playOutline,pauseOutline,heart,heartOutline});

    this.favoritesService.favorites$.subscribe(favorites => {
      this.favorites = favorites;
    });
  }

  async ngOnInit() {
    this.generateBeats();
    // Traccia l'evento con il servizio
    await this.FirebaseAnalytics.logEvent('page_view', { page: 'home' });
    this.initializeApp();
    console.log('Component initialized');
    await this.initializeRecorder();
    this.setupAudioEventListeners();
  }

   private generateBeats(): void {
    // Primo beat senza numero
    this.beats.push({
      id: 0,
      name: 'Beat',
      url: 'https://www.gadgetchespaccano.it/beat2025/beat.mp3',
      isPlaying: false,
      isRecording: false
    });

    // Altri beat numerati da 1 a 250
    for (let i = 1; i <= 250; i++) {
      this.beats.push({
        id: i,
        name: `Beat ${i}`,
        url: `https://www.gadgetchespaccano.it/beat2025/beat${i}.mp3`,
        isPlaying: false,
        isRecording: false
      });
    }
  }

  async initializeApp() {
    try {
      await SplashScreen.show({
        showDuration: 2000,
        autoHide: true
      });
      // Imposta il testo della barra di stato a bianco (per sfondi scuri)
      await StatusBar.setStyle({ style: Style.Dark	 });
        
      // Imposta il colore di sfondo della barra di stato
      await StatusBar.setBackgroundColor({ color: '#282828' });
    } catch (err) {
      console.log('Errore durante l\'inizializzazione dello splash screen', err);
    }
  }
  
  async openInfoModal() {
    const modal = await this.modalCtrl.create({
      component: InfoModalComponent,
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      cssClass: 'info-modal'
    });
    await modal.present();
  }
  
  async toggleFavorite(beat: Beat) {
    try {
      await this.favoritesService.toggleFavorite(beat);
    } catch (error) {
      console.error('[Component] Errore durante il toggle dei preferiti:', error);
    }
  }

  isFavorite(beat: Beat): boolean {
    return this.favorites.some((fav) => fav.id === beat.id);
  }

  ngOnDestroy() {
    this.cleanupAudio();
    
    // Pulisci gli intervalli se sono ancora attivi
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
    }
    
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
  
  // Funzione per formattare il tempo in mm:ss
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  private async initializeRecorder() {
    try {
      await VoiceRecorder.requestAudioRecordingPermission();
      const { value } = await VoiceRecorder.hasAudioRecordingPermission();
      if (!value) {
        await this.showToast('Permessi di registrazione non concessi', 'danger');
      }
    } catch (error) {
      console.error('Error initializing recorder:', error);
      await this.showToast('Errore nell\'inizializzazione del registratore', 'danger');
    }
  }

  private setupAudioEventListeners() {
    if (this.currentAudioElement) {
      this.currentAudioElement.addEventListener('ended', () => {
        this.beats.forEach(beat => beat.isPlaying = false);
      });
    }
  }

  private cleanupAudio() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.src = '';
      this.currentAudioElement.remove();
      this.currentAudioElement = null;
    }
  }

  isPlaying(beat: Beat): boolean {
    return beat.isPlaying || false;
  }

  async playBeat(beat: Beat) {
    try {
      if (this.isPlaying(beat)) {
        this.stopBeat();
        beat.isPlaying = false;
        return;
      }

      this.stopBeat();
      this.beats.forEach(b => b.isPlaying = false);
      beat.isPlaying = true;
      await this.playWebBeat(beat);
    } catch (error) {
      console.error('Error playing beat:', error);
      await this.showToast('Errore nella riproduzione del beat', 'danger');
    }
  }

  private async playWebBeat(beat: Beat) {
    if (this.currentAudioElement) {
      this.currentAudioElement.src = beat.url;
    } else {
      this.currentAudioElement = new Audio(beat.url);
      this.setupAudioEventListeners();
    }

    try {
      await this.currentAudioElement.play();
      console.log('Web audio playing');
    } catch (error) {
      console.error('Error playing web audio', error);
      throw error;
    }
  }

  stopBeat() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.beats.forEach(beat => beat.isPlaying = false);
      console.log('Audio stopped');
    }
  }

  selectForRecording(beat: Beat) {
    this.selectedBeat = beat;
    console.log('Selected for recording:', beat.name);
  }

  async startRecording(beat: Beat) {
    if (beat.isRecording) return;

    try {
      this.stopBeat(); // Ferma qualsiasi beat in riproduzione
      
      this.showCountdown = true;
      this.countdownNumber = 3;
      
      this.countdownInterval = setInterval(async () => {
        this.countdownNumber--;

        if (this.countdownNumber === 0) {
          clearInterval(this.countdownInterval);
          this.showCountdown = false;

          await VoiceRecorder.startRecording();
          this.beats.forEach(b => (b.isRecording = false));
          beat.isRecording = true;
          this.selectedBeat = beat;
          console.log('Recording in progress: ', beat.isRecording);
          await this.showToast('Recording started', 'success');

          this.playBeat(beat);

          this.recordingTime = 0;
          this.recordingInterval = setInterval(() => {
            this.recordingTime++;
            this.remainingTime = this.maxRecordingTime - this.recordingTime;

              // Interrompi quando si raggiunge il limite di tempo
              if (this.recordingTime >= this.maxRecordingTime) {
                this.stopRecording(beat);
                this.showToast('Limite di registrazione di 4 minuti raggiunto', 'danger');
              }
            }, 1000);
        }
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      await this.showToast('Error starting the recording', 'danger');
    }
  }

  // Aggiungi questo metodo per formattare il tempo rimanente in mm:ss
formatRemainingTime(): string {
  return this.formatTime(this.remainingTime);
}

async stopRecording(beat: Beat) {
  if (!beat.isRecording) return;

  try {
    // Ferma il timer
    clearInterval(this.recordingInterval);
    this.recordingInterval = null;
    this.recordedDuration = this.formatTime(this.recordingTime);
    
    // Ferma la registrazione e ottieni i dati in Base64
    const recording = await VoiceRecorder.stopRecording();
    this.recordingData = recording; // Mantieni questo per la compatibilità UI
    
    // Genera un nome file univoco
    const fileName = `recording_${new Date().getTime()}.wav`;
    
    // Salva direttamente nella directory Cache
    const result = await Filesystem.writeFile({
      path: fileName,
      data: recording.value.recordDataBase64 || '',
      directory: Directory.Cache
    });
    
    // Salva sia il percorso che il nome del file
    this.currentFileName = fileName;
    this.recordingFilePath = result.uri;
    
    // Log per debug
    console.log('File salvato in cache:', result.uri);
    console.log('Nome file:', this.currentFileName);
    
    // NON cancellare recordingData qui se il tuo HTML dipende da esso
    // Non fare: this.recordingData.value.recordDataBase64 = '';
    
    beat.isRecording = false;
    await this.showToast('Recording completed', 'success');
    this.selectedBeat = beat;
    this.stopBeat();

    await this.adMobService.showInterstitial();
  } catch (error) {
    console.error('Error stopping recording:', error);
    await this.showToast('Error stopping the recording', 'danger');
  }
  this.logVariables(); // Aggiungi questa riga alla fine
}
  async requestStoragePermissions() {
    try {
      const permissions = await Filesystem.requestPermissions();
      console.log('Storage permissions:', permissions);
    } catch (error) {
      console.error('Error requesting storage permissions:', error);
      await this.showToast('Storage permission error', 'danger');
    }
  }
  
  async saveRecording() {
    if (!this.currentFileName) {
      console.error('Nessun file da salvare');
      return;
    }
  
    try {
      // Richiedi permessi
      await this.requestStoragePermissions();
      
      console.log('Tentativo di lettura del file:', this.currentFileName);
      
      // Leggi il file dalla cache
      const readResult = await Filesystem.readFile({
        path: this.currentFileName,
        directory: Directory.Cache
      });
      
      console.log('File letto dalla cache con successo');
      
      // Genera un nuovo nome file per la destinazione
      const destinationFileName = `recording_${new Date().getTime()}.wav`;
      
      // Scrivi direttamente il contenuto nella directory Documents
      const writeResult = await Filesystem.writeFile({
        path: destinationFileName,
        data: readResult.data, // Questo è il contenuto del file
        directory: Directory.Documents
      });
      
      this.savedFilePath = writeResult.uri;
      console.log('File salvato in Documents:', writeResult.uri);
      await this.showToast(`Recording saved: ${destinationFileName}`, 'success');
      this.isRecordingDownloaded = true;
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      await this.showToast('Error saving the recording', 'danger');
    }
  }
  async openFile(filePath: string) {
    try {
      await FileOpener.openFile({ path: filePath });
    } catch (error) {
      console.error('Errore nell\'apertura del file:', error);
      await this.showToast('Error opening the file', 'danger');
    }
  }
  
// Il metodo playRecording deve essere aggiornato per usare il file locale
async playRecording() {
  try {
    // Ferma la riproduzione precedente se esiste
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer = null;
    }
    
    let audioPath = '';
    
    // Se stiamo riproducendo dopo aver salvato, usa il percorso salvato
    if (this.isRecordingDownloaded && this.savedFilePath) {
      audioPath = Capacitor.convertFileSrc(this.savedFilePath);
      console.log('Riproducendo file salvato:', audioPath);
    } 
    // Altrimenti usa il file nella cache
    else if (this.recordingFilePath) {
      audioPath = Capacitor.convertFileSrc(this.recordingFilePath);
      console.log('Riproducendo file dalla cache:', audioPath);
    } else {
      console.error('Nessun file da riprodurre');
      return;
    }
    
    // Crea e riproduce l'audio
    this.audioPlayer = new Audio(audioPath);
    this.audioPlayer.onended = () => {
      this.playRecordedAudio = false;
    };
    
    await this.audioPlayer.play();
    this.playRecordedAudio = true;
  } catch (error) {
    console.error('Error playing recording:', error);
    await this.showToast('Error playing the recording', 'danger');
  }
}

  async stopPlayRecording() {
    if (!this.audioPlayer) return;

    try {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
      this.playRecordedAudio = false;

      // Controlla se mostrare il popup di rating
      const shouldShowRating = await this.ratingService.shouldShowRatingPrompt();
      if (shouldShowRating) {
        const modal = await this.modalCtrl.create({
          component: RatingPopupComponent,
          cssClass: 'transparent-modal',
          backdropDismiss: true,
          breakpoints: [0, 1],
          initialBreakpoint: 1
        });
        await modal.present();
      }

    } catch (error) {
      console.error('Error stopping playback:', error);
      await this.showToast('Error stopping playback', 'danger');
    }
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
  
    await toast.present();
  }
  // Aggiungi questo metodo per il debug
logVariables() {
  console.log('Debug variabili UI:');
  console.log('recordingData presente:', !!this.recordingData);
  console.log('recordingFilePath:', this.recordingFilePath);
  console.log('isRecordingDownloaded:', this.isRecordingDownloaded);
  console.log('playRecordedAudio:', this.playRecordedAudio);
}
  
  closeSelectedBeat() {
    this.selectedBeat = null;
    this.recordedDuration = '';
    this.recordingData = null;
    this.isRecordingDownloaded = false;
    this.recordingFilePath = null; // Modificato da recordedAudio
    this.currentFileName = '';
    this.savedFilePath = '';
  }
  
  isAnyBeatRecording(): boolean {
    return this.beats.some(beat => beat.isRecording);
  }
}