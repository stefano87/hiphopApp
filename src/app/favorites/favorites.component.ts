import { Component, OnInit,OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController,IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
         IonLabel, IonButton, IonIcon, IonToast,ToastController, IonButtons, IonModal } from '@ionic/angular/standalone';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { 
  playOutline, 
  pauseOutline, 
  micOutline, 
  stopOutline, 
  saveOutline, 
  musicalNotesOutline,
  radioOutline,
  heart,
  heartOutline, heartDislike, micCircleOutline, informationCircleOutline, closeCircleOutline, timeOutline, folderOpenOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Capacitor } from '@capacitor/core';
import { FavoritesService } from '../favorites.service';
import { AdMobService } from '../services/admob.service';
import { FileOpener } from '@capawesome-team/capacitor-file-opener';
import { InfoModalComponent } from '../info-modal/info-modal.component';

interface Beat {
  id: number;
  name: string;
  url: string;
  isPlaying?: boolean;
  isRecording: boolean;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [IonModal, IonButtons, 
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon
  ],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent  implements OnInit, OnDestroy {
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
    favorites: Beat[] = [];
  selectedBeat: any | null = null;
  currentAudioElement: HTMLAudioElement | null = null;
  isRecording: boolean = false;
  recordingData: any = null;
  isRecordingDownloaded: boolean = false;
  recordedAudio: string | null = null;
  playRecordedAudio: boolean = false;
  showCountdown: boolean = false;
  countdownNumber: number = 3;
  private countdownInterval: any;
  audioPlayer: HTMLAudioElement | null = null; // Mantieni l'istanza globale dell'audio
  recordingTime: number = 0; // Tempo trascorso in secondi
recordingInterval: any = null; // ID del setInterval
recordedDuration: string = ''; // Durata finale registrata
savedFilePath: string = '';

constructor(private modalCtrl: ModalController,private toastController: ToastController,private favoritesService: FavoritesService,private adMobService: AdMobService) {
  // Registra le icone
  addIcons({musicalNotesOutline,informationCircleOutline,radioOutline,stopOutline,heartDislike,closeCircleOutline,timeOutline,saveOutline,folderOpenOutline,playOutline,micCircleOutline,pauseOutline,heart,heartOutline});
 
  this.favoritesService.favorites$.subscribe(favorites => {
    this.favorites = favorites;
  });
}
  async ngOnInit() {
    console.log('Component initialized');
    console.log('favoriti: ', this.favorites);
    await this.initializeRecorder();
    this.setupAudioEventListeners();
    
  }

ngOnDestroy() {
  this.cleanupAudio();
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
        this. favorites.forEach(beat => beat.isPlaying = false);
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
      this.favorites.forEach(b => b.isPlaying = false);
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
      this.favorites.forEach(beat => beat.isPlaying = false);
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
      this.favorites.forEach(b => (b.isRecording = false)); // Assicura che tutti i beat siano non registranti
    beat.isRecording = true; // Imposta il beat corrente come in registrazione
    this.selectedBeat = beat; // Aggiorna il beat selezionato
    console.log('Recording in progress: ', beat.isRecording);
    await this.showToast('Recording started', 'success');

    this.playBeat(beat);

    this.recordingTime = 0; // Resetta il timer
    this.recordingInterval = setInterval(() => {
      this.recordingTime++;
    }, 1000); // Aggiorna il timer ogni secondo

      //this.selectedBeat = beat;
}
    }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      await this.showToast('Error starting the recording', 'danger');
    }
  }

  
   async stopRecording(beat:Beat) {
     if (!beat.isRecording) return;
 
     try {
       const recording = await VoiceRecorder.stopRecording();
       this.recordingData = recording;
       this.recordedAudio = recording.value.recordDataBase64;
       beat.isRecording = false;
 
       // Ferma il timer
     clearInterval(this.recordingInterval);
     this.recordingInterval = null;
     this.recordedDuration = this.formatTime(this.recordingTime); // Salva la durata finale
 
     
       await this.showToast('Recording completed', 'success');
       this.selectedBeat = beat;
       this.stopBeat();
 
       await this.adMobService.showInterstitial();
 
     } catch (error) {
       console.error('Error stopping recording:', error);
       await this.showToast('Error stopping the recording', 'danger');
     }
   }
   base64ToBlob(base64Data: string, contentType: string): Blob {
    const byteCharacters = atob(base64Data); // Decodifica la stringa Base64
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
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
    if (!this.recordingData) return;
  
    try {
      // Richiedi permessi
      await this.requestStoragePermissions();
  
      const fileName = `recording_${new Date().getTime()}.wav`;
      
      const result = await Filesystem.writeFile({
        path: fileName,
        data: this.recordedAudio!,
        directory: Directory.Documents,
        recursive: true
      });
    
      this.savedFilePath = result.uri; // Salviamo il percorso per usarlo altrove
      console.log('File salvato:', result);
      await this.showToast(`Recording saved in the main folder: ${result.uri}`, 'success');
      this.isRecordingDownloaded = true;
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      // Log dettagliato dell'errore
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
    
    // Metodo per mostrare un popup di conferma
    async showConfirmationPopup(message: string) {
      const alert = document.createElement('ion-alert');
      alert.header = 'Conferma';
      alert.message = message;
      alert.buttons = ['OK'];
    
      document.body.appendChild(alert);
      await alert.present();
    }
    
    async playRecording() {
      if (!this.recordedAudio) return;
    
      try {
        // Se l'audio è già in riproduzione, fermalo prima di riprodurlo nuovamente
        if (this.audioPlayer) {
          this.audioPlayer.pause();
          this.audioPlayer.currentTime = 0;
        }
    
        // Crea una nuova istanza Audio solo se necessario
        this.audioPlayer = new Audio(`data:audio/wav;base64,${this.recordedAudio}`);
        this.audioPlayer.onended = () => {
          this.playRecordedAudio = false; // Riproduzione terminata
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
        this.audioPlayer.currentTime = 0; // Riporta l'audio all'inizio
        this.playRecordedAudio = false;
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
    closeSelectedBeat(){
      this.selectedBeat = null;
      this.recordedDuration = '';
      this.recordingData = null;
      this.isRecordingDownloaded = false;
      this.recordedAudio = null;
    }

    isAnyBeatRecording(): boolean {
      return this.favorites.some(beat => beat.isRecording);
    }
  
    async toggleFavorite(beat: Beat) {
      try {
        await this.favoritesService.toggleFavorite(beat);
      } catch (error) {
        console.error('[Component] Errore durante il toggle dei preferiti:', error);
      }
    }

}
