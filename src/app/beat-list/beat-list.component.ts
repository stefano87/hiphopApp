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
  beats: Beat[] = [
    { id: 1, name: 'Beat 1', url: 'https://www.gadgetchespaccano.it/sound/hiphop/beat5.mp3', isPlaying: false, isRecording: false },
    { id: 2, name: 'Beat 2', url: 'https://www.gadgetchespaccano.it/sound/hiphop/beat3.mp3', isPlaying: false, isRecording: false },
    { id: 3, name: 'Beat 3', url: 'https://www.gadgetchespaccano.it/HipHop/Mellow-Freestyle-Beat.mp3', isPlaying: false, isRecording: false },
    { id: 4, name: 'Beat 4', url: 'https://www.gadgetchespaccano.it/HipHop/Method-Man-&-Redman---Y.O.U.-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 5, name: 'Beat 5', url: 'https://www.gadgetchespaccano.it/HipHop/Method-Man---Grid-Iron-Rap-[Instrumental].mp3', isPlaying: false, isRecording: false },
    { id: 6, name: 'Beat 6', url: 'https://www.gadgetchespaccano.it/HipHop/Mic-Geronimo---Unstoppable-(Pete-Rock-Instrumental)-(1996).mp3', isPlaying: false, isRecording: false },
    { id: 7, name: 'Beat 7', url: 'https://www.gadgetchespaccano.it/HipHop/Missy-Elliot---Ching-ling-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 8, name: 'Beat 8', url: 'https://www.gadgetchespaccano.it/sound/hiphop/beat4.mp3', isPlaying: false, isRecording: false },
    { id: 9, name: 'Beat 9', url: 'https://gadgetchespaccano.it/sound/hiphop/beat1.mp3', isPlaying: false, isRecording: false },
    { id: 10, name: 'Beat 10', url: "https://www.gadgetchespaccano.it/HipHop/Mobb-Deep-'Bloodsport'-Instrumental.mp3", isPlaying: false, isRecording: false },
    { id: 11, name: 'Beat 11', url: 'https://www.gadgetchespaccano.it/HipHop/Mic-Geronimo---Unstoppable-(Vinyl-Reanimators-Remix-Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 12, name: 'Beat 12', url: 'https://www.gadgetchespaccano.it/HipHop/Necro---I\'m-Sick-of-You-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 13, name: 'Beat 13', url: 'https://www.gadgetchespaccano.it/sound/hiphop/beat2.mp3', isPlaying: false, isRecording: false },
    { id: 14, name: 'Beat 14', url: 'https://www.gadgetchespaccano.it/HipHop/Missy-Elliot-ft-Jay-Z---Wake-Up-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 15, name: 'Beat 15', url: 'https://www.gadgetchespaccano.it/HipHop/Necro---Hoe-Blow-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 16, name: 'Beat 16', url: 'https://www.gadgetchespaccano.it/HipHop/Necro---Underground-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 17, name: 'Beat 17', url: 'https://www.gadgetchespaccano.it/HipHop/ODB---Protect-Ya-Neck-II-The-Zoo-(Instrumental)-[Track-14].mp3', isPlaying: false, isRecording: false },
    { id: 18, name: 'Beat 18', url: 'https://www.gadgetchespaccano.it/HipHop/OLD-TIMES---INSTRUMENTAL-RAP-OLD-SCHOOL-2017-FREE-USE.mp3', isPlaying: false, isRecording: false },
    { id: 19, name: 'Beat 19', url: 'https://www.gadgetchespaccano.it/HipHop/OLDSCHOOL-HIPHOP-BEAT---Recall-(By-Anitek).mp3', isPlaying: false, isRecording: false },
    { id: 20, name: 'Beat 20', url: 'https://www.gadgetchespaccano.it/HipHop/Old-Dirty-Bastard---Pop-Shots-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 21, name: 'Beat 21', url: "https://www.gadgetchespaccano.it/HipHop/Old-Dirty-Bastard---Don't-you-know-instrumental.mp3", isPlaying: false, isRecording: false },
    { id: 22, name: 'Beat 22', url: 'https://www.gadgetchespaccano.it/HipHop/Old-Dirty-Bastard---Goin\'-Down-instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 23, name: 'Beat 23', url: 'https://www.gadgetchespaccano.it/HipHop/On_The_Grind_HipHop_Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 24, name: 'Beat 24', url: 'https://www.gadgetchespaccano.it/HipHop/One_Time_-_Raw_Oldschool_HipHop_Instrumental_Freebeat.mp3', isPlaying: false, isRecording: false },
    { id: 25, name: 'Beat 25', url: 'https://www.gadgetchespaccano.it/HipHop/Pete-Rock---Appreciate---Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 26, name: 'Beat 26', url: 'https://www.gadgetchespaccano.it/HipHop/Pete-Rock---Cake-(feat-The-U.N.).mp3', isPlaying: false, isRecording: false },
    { id: 27, name: 'Beat 27', url: 'https://www.gadgetchespaccano.it/HipHop/Pete-Rock---Creepin-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 28, name: 'Beat 28', url: 'https://www.gadgetchespaccano.it/HipHop/Pete-Rock---Give-It-To-Ya-(Orignal-Version-Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 29, name: 'Beat 29', url: 'https://www.gadgetchespaccano.it/HipHop/Pete-Rock---Pete\'s-Jazz.mp3', isPlaying: false, isRecording: false },
    { id: 30, name: 'Beat 30', url: 'https://www.gadgetchespaccano.it/HipHop/Pete-Rock---Til-I-Retire-_instrumental_.mp3', isPlaying: false, isRecording: false },
    { id: 31, name: 'Beat 31', url: 'https://www.gadgetchespaccano.it/HipHop/Pete-Rock---Watch-Me-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 32, name: 'Beat 32', url: 'https://www.gadgetchespaccano.it/HipHop/Pete-Rock-feat.-The-UN---Cake-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 33, name: 'Beat 33', url: 'https://www.gadgetchespaccano.it/HipHop/Pete-Rock-feat.-The-UN---Cake-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 34, name: 'Beat 34', url: 'https://www.gadgetchespaccano.it/HipHop/Phat-Kat---Don\'t-Nobody-Care-About-Us-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 35, name: 'Beat 35', url: 'https://www.gadgetchespaccano.it/HipHop/Push---Medaphoar---Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 36, name: 'Beat 36', url: 'https://www.gadgetchespaccano.it/HipHop/Q-Tip-_-J-Dilla---Put-It-Down-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 37, name: 'Beat 37', url: 'https://www.gadgetchespaccano.it/HipHop/Rakim---Hip-Hop-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 38, name: 'Beat 38', url: 'https://www.gadgetchespaccano.it/HipHop/Ras-Kass---Understandable-Smooth-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 39, name: 'Beat 39', url: 'https://www.gadgetchespaccano.it/HipHop/Redman-\'Can\'t-Wait\'-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 40, name: 'Beat 40', url: 'https://www.gadgetchespaccano.it/HipHop/Redman---Funkorama-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 41, name: 'Beat 41', url: 'https://www.gadgetchespaccano.it/HipHop/Redman---INSTRUMENTAL---Rockafella-(Remix).mp3', isPlaying: false, isRecording: false },
    { id: 42, name: 'Beat 42', url: 'https://www.gadgetchespaccano.it/HipHop/Redman---Put-it-Down-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 43, name: 'Beat 43', url: 'https://www.gadgetchespaccano.it/HipHop/Redman-and-Busta-Rhymes---Da-Goodness-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 44, name: 'Beat 44', url: 'https://www.gadgetchespaccano.it/HipHop/Reggie-Noble-&-Rockwilder---Fades-Em-All-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 45, name: 'Beat 45', url: 'https://www.gadgetchespaccano.it/HipHop/Remember-The-Name---Swollen-Members---(Brock-Vs-Hades)-Round-1---(Bases-Final-Nacional-Barcelona.mp3', isPlaying: false, isRecording: false },
    { id: 46, name: 'Beat 46', url: 'https://www.gadgetchespaccano.it/HipHop/SMILEY-THE-GHETTO-CHILD-_-DJ-PREMIER---THE-WAKE-UP-CALL-(INSTRUMENTAL).mp3', isPlaying: false, isRecording: false },
    { id: 47, name: 'Beat 47', url: 'https://www.gadgetchespaccano.it/HipHop/SNIPER---\'PRIS-POUR-CIBLE\'-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 48, name: 'Beat 48', url: 'https://www.gadgetchespaccano.it/HipHop/SOLDSHORT-STORY--90s-Boom-Bap-Type-Beat-(Old-School-Mobb-Deep-Style-HipHopRap-Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 49, name: 'Beat 49', url: 'https://www.gadgetchespaccano.it/HipHop/SOUTHWEST-T.V.---GTA-IV-INSTRUMENTAL.mp3', isPlaying: false, isRecording: false },
    { id: 50, name: 'Beat 50', url: 'https://www.gadgetchespaccano.it/HipHop/DJ-Premier---It\'s-all-real-(instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 51, name: 'Beat 51', url: 'https://www.gadgetchespaccano.it/HipHop/DJ-Premier---718-(instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 52, name: 'Beat 52', url: 'https://www.gadgetchespaccano.it/HipHop/Common---Cold-Blooded-(instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 53, name: 'Beat 53', url: 'https://www.gadgetchespaccano.it/HipHop/Common---6th-Sense-(instrumental.-dj-premier).mp3', isPlaying: false, isRecording: false },
    { id: 54, name: 'Beat 54', url: 'https://www.gadgetchespaccano.it/HipHop/Common---1999-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 55, name: 'Beat 55', url: 'https://www.gadgetchespaccano.it/HipHop/Club-Ghetto---Ghetto-Misery-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 56, name: 'Beat 56', url: 'https://www.gadgetchespaccano.it/HipHop/Brainsick-Enterprize---Playin-For-Keeps-(Instrumental)-(1997)-[HQ].mp3', isPlaying: false, isRecording: false },
    { id: 57, name: 'Beat 57', url: 'https://www.gadgetchespaccano.it/HipHop/Black-Moon-Act-Like-U-Want-It-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 58, name: 'Beat 58', url: 'https://www.gadgetchespaccano.it/HipHop/Biz-Markie-\'Vapors\'-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 59, name: 'Beat 59', url: 'https://www.gadgetchespaccano.it/HipHop/Big_City_Dreams_HipHop_Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 59, name: 'Beat 59', url: 'https://www.gadgetchespaccano.it/HipHop/Big-Shug---Crush-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 60, name: 'Beat 60', url: 'https://www.gadgetchespaccano.it/HipHop/Big-L---The-Sandman-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 61, name: 'Beat 61', url: 'https://www.gadgetchespaccano.it/HipHop/Big-L---Street-Struck-(Lord-Finesse-Instrumental)-(1995)-[HQ].mp3', isPlaying: false, isRecording: false },
    { id: 62, name: 'Beat 62', url: 'https://www.gadgetchespaccano.it/HipHop/Big-L-\'Timez-Iz-Hard\'-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 63, name: 'Beat 63', url: 'https://www.gadgetchespaccano.it/HipHop/Beat6-Game-Over.mp3', isPlaying: false, isRecording: false },
    { id: 64, name: 'Beat 64', url: 'https://www.gadgetchespaccano.it/HipHop/Batman-Sample-Beat.mp3', isPlaying: false, isRecording: false },
    { id: 65, name: 'Beat 65', url: 'https://www.gadgetchespaccano.it/HipHop/Barry-White-Sample-Beat.mp3', isPlaying: false, isRecording: false },
    { id: 66, name: 'Beat 66', url: 'https://www.gadgetchespaccano.it/HipHop/Amnesia_Raw_Oldschool_HipHop_Beat.mp3', isPlaying: false, isRecording: false },
    { id: 67, name: 'Beat 67', url: 'https://www.gadgetchespaccano.it/HipHop/Aggressive-Rap-Beat.mp3', isPlaying: false, isRecording: false },
    { id: 68, name: 'Beat 68', url: 'https://www.gadgetchespaccano.it/HipHop/Adrenaline_Raw_HipHop_Beat.mp3', isPlaying: false, isRecording: false },
    { id: 69, name: 'Beat 69', url: 'https://www.gadgetchespaccano.it/HipHop/A+---Whatcha-Weigh-Me-(Instrumental)-(1999)-[HQ].mp3', isPlaying: false, isRecording: false },
    { id: 70, name: 'Beat 70', url: 'https://www.gadgetchespaccano.it/HipHop/90\'s-NY-BOOM-BAP-BEAT.mp3', isPlaying: false, isRecording: false },
    { id: 71, name: 'Beat 71', url: 'https://www.gadgetchespaccano.it/HipHop/90\'S-BOOM-BAP-HIP-HOP-INSTRUMENTAL-BEAT---TRILLA-(PROD-BY-OUTSPOKEN).mp3', isPlaying: false, isRecording: false },
    { id: 72, name: 'Beat 72', url: 'https://www.gadgetchespaccano.it/HipHop/90\'S-BOOM-BAP-HIP-HOP-INSTRUMENTAL-BEAT---FLOWERS-(PROD-BY-OUTSPOKEN).mp3', isPlaying: false, isRecording: false },
    { id: 73, name: 'Beat 73', url: 'https://www.gadgetchespaccano.it/HipHop/7L-&-Esoteric---Stalker-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 74, name: 'Beat 74', url: 'https://www.gadgetchespaccano.it/HipHop/1928-SITAR---808-HARD-BEAT-RAP-HIP-HOP-INSTRUMENTAL.mp3', isPlaying: false, isRecording: false },
    { id: 75, name: 'Beat 75', url: 'https://www.gadgetchespaccano.it/HipHop/Waves-HipHop-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 76, name: 'Beat 76', url: 'https://www.gadgetchespaccano.it/HipHop/Thug-Rap-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 77, name: 'Beat 77', url: 'https://www.gadgetchespaccano.it/HipHop/Smif-N-Wessun---Next-Shit-(Instrumental-1995)&rlm;.mp3', isPlaying: false, isRecording: false },
    { id: 78, name: 'Beat 78', url: 'https://www.gadgetchespaccano.it/HipHop/Sad-Piano-Beat-(dark-underground-mood).mp3', isPlaying: false, isRecording: false },
    { id: 79, name: 'Beat 79', url: 'https://www.gadgetchespaccano.it/HipHop/Scary-Freestyle-Rap-Beat-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 80, name: 'Beat 80', url: 'https://www.gadgetchespaccano.it/HipHop/Sean-price---Boom-bye-yeah-(instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 81, name: 'Beat 81', url: 'https://www.gadgetchespaccano.it/HipHop/Shabazz-the-Disciple---Crime-Saga-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 82, name: 'Beat 82', url: 'https://www.gadgetchespaccano.it/HipHop/Shaolin-Style-Hip-Hop-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 83, name: 'Beat 83', url: 'https://www.gadgetchespaccano.it/HipHop/Shyne---Here-With-Me-(instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 84, name: 'Beat 84', url: 'https://www.gadgetchespaccano.it/HipHop/Smooth-freestyle-beat.mp3', isPlaying: false, isRecording: false },
    { id: 85, name: 'Beat 85', url: 'https://www.gadgetchespaccano.it/HipHop/Souls-of-Mischief---Rock-It-Like-That-(Instrumental)-(1995)-[HQ].mp3', isPlaying: false, isRecording: false },
    { id: 86, name: 'Beat 86', url: 'https://www.gadgetchespaccano.it/HipHop/Sox---MPC2000XL-90\'S-DARK-JAZZ-OLDSCHOOL-BOOM-BAP-HIP-HOP-INSTRUMENTAL.mp3', isPlaying: false, isRecording: false },
    { id: 87, name: 'Beat 87', url: 'https://www.gadgetchespaccano.it/HipHop/Sox---WASTED-TIME---MPC2000XL---90\'S-DARK-OLDSCHOOL-BOOM-BAP-HIP-HOP-INSTRUMENTAL.mp3', isPlaying: false, isRecording: false },
    { id: 88, name: 'Beat 88', url: 'https://www.gadgetchespaccano.it/HipHop/spaced-Out-Hip-Hop.mp3', isPlaying: false, isRecording: false },
    { id: 89, name: 'Beat 89', url: 'https://www.gadgetchespaccano.it/HipHop/Special-(Instrumental)-The-game.mp3', isPlaying: false, isRecording: false },
    { id: 90, name: 'Beat 90', url: 'https://www.gadgetchespaccano.it/HipHop/Start-It-Up-(Instrumental)---Lloyd-Banks.mp3', isPlaying: false, isRecording: false },
    { id: 91, name: 'Beat 91', url: 'https://www.gadgetchespaccano.it/HipHop/TRIPPY-RAP-BEAT-(High-Quality).mp3', isPlaying: false, isRecording: false },
    { id: 92, name: 'Beat 92', url: 'https://www.gadgetchespaccano.it/HipHop/The-Alchemist---Dead-Bodies-(instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 93, name: 'Beat 93', url: 'https://www.gadgetchespaccano.it/HipHop/The-Beatnuts---Get-Funky-(Instrumental)-(1994)-[HQ].mp3', isPlaying: false, isRecording: false },
    { id: 94, name: 'Beat 94', url: 'https://www.gadgetchespaccano.it/sound/hiphop/beat10.mp3', isPlaying: false, isRecording: false },
    { id: 95, name: 'Beat 95', url: 'https://www.gadgetchespaccano.it/sound/hiphop/beat8.mp3', isPlaying: false, isRecording: false },
    { id: 96, name: 'Beat 96', url: 'https://www.gadgetchespaccano.it/HipHop/2020/hiphop9.mp3', isPlaying: false, isRecording: false },
    { id: 97, name: 'Beat 97', url: 'https://www.gadgetchespaccano.it/HipHop/2020/hiphop8.mp3', isPlaying: false, isRecording: false },
    { id: 98, name: 'Beat 98', url: 'https://www.gadgetchespaccano.it/HipHop/2020/hiphop7.mp3', isPlaying: false, isRecording: false },
    { id: 99, name: 'Beat 99', url: 'https://www.gadgetchespaccano.it/HipHop/2020/hiphop6.mp3', isPlaying: false, isRecording: false },
    { id: 100, name: 'Beat 100', url: 'https://www.gadgetchespaccano.it/sound/hiphop/beat7.mp3', isPlaying: false, isRecording: false },
    { id: 101, name: 'Beat 101', url: 'https://www.gadgetchespaccano.it/sound/hiphop/beat9.mp3', isPlaying: false, isRecording: false },
    { id: 102, name: 'Beat 102', url: 'https://www.gadgetchespaccano.it/sound/hiphop/beat6.mp3', isPlaying: false, isRecording: false },
    { id: 103, name: 'Beat 103', url: 'https://www.gadgetchespaccano.it/HipHop/2020/hiphop5.mp3', isPlaying: false, isRecording: false },
    { id: 104, name: 'Beat 104', url: 'https://www.gadgetchespaccano.it/HipHop/2020/hiphop4.mp3', isPlaying: false, isRecording: false },
    { id: 105, name: 'Beat 105', url: 'https://www.gadgetchespaccano.it/HipHop/2020/hiphop3.mp3', isPlaying: false, isRecording: false },
    { id: 106, name: 'Beat 106', url: 'https://www.gadgetchespaccano.it/HipHop/2020/hiphop2.mp3', isPlaying: false, isRecording: false },
    { id: 107, name: 'Beat 107', url: 'https://www.gadgetchespaccano.it/HipHop/2020/hiphop1.mp3', isPlaying: false, isRecording: false },
    { id: 108, name: 'Beat 108', url: 'https://www.gadgetchespaccano.it/HipHop/2020/hiphop10.mp3', isPlaying: false, isRecording: false },
    { id: 109, name: 'Beat 109', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-1.mp3', isPlaying: false, isRecording: false },
    { id: 110, name: 'Beat 110', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-2.mp3', isPlaying: false, isRecording: false },
    { id: 111, name: 'Beat 111', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-3.mp3', isPlaying: false, isRecording: false },
    { id: 112, name: 'Beat 112', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-4.mp3', isPlaying: false, isRecording: false },
    { id: 113, name: 'Beat 113', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-5.mp3', isPlaying: false, isRecording: false },
    { id: 114, name: 'Beat 114', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-6.mp3', isPlaying: false, isRecording: false },
    { id: 115, name: 'Beat 115', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-7.mp3', isPlaying: false, isRecording: false },
    { id: 116, name: 'Beat 116', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-8.mp3', isPlaying: false, isRecording: false },
    { id: 117, name: 'Beat 117', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-9.mp3', isPlaying: false, isRecording: false },
    { id: 118, name: 'Beat 118', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-10.mp3', isPlaying: false, isRecording: false },
    { id: 119, name: 'Beat 119', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-11.mp3', isPlaying: false, isRecording: false },
    { id: 120, name: 'Beat 120', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-12.mp3', isPlaying: false, isRecording: false },
    { id: 121, name: 'Beat 121', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-13.mp3', isPlaying: false, isRecording: false },
    { id: 122, name: 'Beat 122', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-14.mp3', isPlaying: false, isRecording: false },
    { id: 123, name: 'Beat 123', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-15.mp3', isPlaying: false, isRecording: false },
    { id: 124, name: 'Beat 124', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-16.mp3', isPlaying: false, isRecording: false },
    { id: 125, name: 'Beat 125', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-17.mp3', isPlaying: false, isRecording: false },
    { id: 126, name: 'Beat 126', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-18.mp3', isPlaying: false, isRecording: false },
    { id: 127, name: 'Beat 127', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-19.mp3', isPlaying: false, isRecording: false },
    { id: 128, name: 'Beat 128', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-20.mp3', isPlaying: false, isRecording: false },
    { id: 129, name: 'Beat 129', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-21.mp3', isPlaying: false, isRecording: false },
    { id: 130, name: 'Beat 130', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-22.mp3', isPlaying: false, isRecording: false },
    { id: 131, name: 'Beat 131', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-23.mp3', isPlaying: false, isRecording: false },
    { id: 132, name: 'Beat 132', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-24.mp3', isPlaying: false, isRecording: false },
    { id: 133, name: 'Beat 133', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-25.mp3', isPlaying: false, isRecording: false },
    { id: 134, name: 'Beat 134', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-26.mp3', isPlaying: false, isRecording: false },
    { id: 135, name: 'Beat 135', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-27.mp3', isPlaying: false, isRecording: false },
    { id: 136, name: 'Beat 136', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-28.mp3', isPlaying: false, isRecording: false },
    { id: 137, name: 'Beat 137', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-29.mp3', isPlaying: false, isRecording: false },
    { id: 138, name: 'Beat 138', url: 'https://www.gadgetchespaccano.it/HipHop/2020/beat-30.mp3', isPlaying: false, isRecording: false },
    { id: 139, name: 'Beat 139', url: 'https://www.gadgetchespaccano.it/HipHop/Masta-Killa---Digi-Warfare-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 140, name: 'Beat 140', url: 'https://www.gadgetchespaccano.it/HipHop/Mass-Influence---Space-Cases-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 141, name: 'Beat 141', url: 'https://www.gadgetchespaccano.it/HipHop/Mass-Influence---Rhyme-Placement-_-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 142, name: 'Beat 142', url: 'https://www.gadgetchespaccano.it/HipHop/Macy-Gray---I\'ve-committed-murder-(Dj-Premier-instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 143, name: 'Beat 143', url: 'https://www.gadgetchespaccano.it/HipHop/Losing-My-Mind-Pt2-HipHop-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 144, name: 'Beat 144', url: 'https://www.gadgetchespaccano.it/HipHop/Lord-Finesse--No-Gimmicks-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 145, name: 'Beat 145', url: 'https://www.gadgetchespaccano.it/HipHop/Lord-Finesse---School-Daze-(Instrumental)-(2006)-[HQ].mp3', isPlaying: false, isRecording: false },
    { id: 146, name: 'Beat 146', url: 'https://www.gadgetchespaccano.it/HipHop/Lord-Finesse---No-Doubt-(Remix-Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 147, name: 'Beat 147', url: 'https://www.gadgetchespaccano.it/HipHop/Lord-Finesse---Money-Talks-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 148, name: 'Beat 148', url: 'https://www.gadgetchespaccano.it/HipHop/Lord-Finesse---Makes-the-World-go-Round-(Instrumental)-(2006)-[HQ].mp3', isPlaying: false, isRecording: false },
    { id: 149, name: 'Beat 149', url: 'https://www.gadgetchespaccano.it/HipHop/Lord-Finesse---Intro-(Instrumental)-(2006)-[HQ].mp3', isPlaying: false, isRecording: false },
    { id: 150, name: 'Beat 150', url: 'https://www.gadgetchespaccano.it/HipHop/Lord-Finesse---Gameplan-(Instrumental)-(1995)-[HQ].mp3', isPlaying: false, isRecording: false },
    { id: 151, name: 'Beat 151', url: 'https://www.gadgetchespaccano.it/HipHop/Lord-Finesse---Do-your-Thing-(Instrumental)-(1996).mp3', isPlaying: false, isRecording: false },
    { id: 152, name: 'Beat 152', url: 'https://www.gadgetchespaccano.it/HipHop/Lord-Finesse---Check-the-Method-(Instrumental)-(1996).mp3', isPlaying: false, isRecording: false },
    { id: 153, name: 'Beat 153', url: 'https://www.gadgetchespaccano.it/HipHop/Lord-Finesse---All-Black-(Instrumental)-(2006)-[HQ].mp3', isPlaying: false, isRecording: false },
    { id: 154, name: 'Beat 154', url: 'https://www.gadgetchespaccano.it/HipHop/Lord-Finesse-\'Underworld-Operations\'-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 155, name: 'Beat 155', url: 'https://www.gadgetchespaccano.it/HipHop/LA-MEJOR-BASE-DE-TODOS-LOS-TIEMPOS-(junior-vs-rayden-1).mp3', isPlaying: false, isRecording: false },
    { id: 156, name: 'Beat 156', url: 'https://www.gadgetchespaccano.it/HipHop/Kool-Keith---Test-Press-[Instrumental].mp3', isPlaying: false, isRecording: false },
    { id: 157, name: 'Beat 157', url: 'https://www.gadgetchespaccano.it/HipHop/Kool-G-Rap---First-Nigga-(instrumental.-dj-premier).mp3', isPlaying: false, isRecording: false },
    { id: 158, name: 'Beat 158', url: 'https://www.gadgetchespaccano.it/HipHop/Killah-Priest-Instrumental-No-You-Wont.mp3', isPlaying: false, isRecording: false },
    { id: 159, name: 'Beat 159', url: 'https://www.gadgetchespaccano.it/HipHop/Killah-Priest---When-I\'m-Writing-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 160, name: 'Beat 160', url: 'https://www.gadgetchespaccano.it/HipHop/K-DEF---STREET-LIFE-(\'RETURN-TO-THE-ESSENTIALS\'-REMIX-INSTRUMENTAL).mp3', isPlaying: false, isRecording: false },
    { id: 161, name: 'Beat 161', url: 'https://www.gadgetchespaccano.it/HipHop/Just_a_Moment_-_Blunted_HipHop_Beat.mp3', isPlaying: false, isRecording: false },
    { id: 162, name: 'Beat 162', url: 'https://www.gadgetchespaccano.it/HipHop/Just-Blaze---Plan-B-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 163, name: 'Beat 163', url: 'https://www.gadgetchespaccano.it/HipHop/Joe-Budden---Pump-It-Up-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 164, name: 'Beat 164', url: 'https://www.gadgetchespaccano.it/HipHop/Jim-Jones---We-Fly-High-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 165, name: 'Beat 165', url: 'https://www.gadgetchespaccano.it/HipHop/Jay-z-and-Timbaland---Lobster-and-Shrimp-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 166, name: 'Beat 166', url: 'https://www.gadgetchespaccano.it/HipHop/Jamal---Fades-Em-All-(Instrumental)-(1995)-[HQ].mp3', isPlaying: false, isRecording: false },
    { id: 167, name: 'Beat 167', url: 'https://www.gadgetchespaccano.it/HipHop/Jamal---Fade-em-all-(Pete-Rock-remix-instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 168, name: 'Beat 168', url: 'https://www.gadgetchespaccano.it/HipHop/JRLISKE--THE-WRONG-SIDE-OF-TOWN---HARD-DARK-90S-BOOM-BAP-INSTRUMENTAL-(SOLD).mp3', isPlaying: false, isRecording: false },
    { id: 169, name: 'Beat 169', url: 'https://www.gadgetchespaccano.it/HipHop/J-Live---The-Best-Part-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 170, name: 'Beat 170', url: 'https://www.gadgetchespaccano.it/HipHop/J-Live---Kick-It-To-The-Beat-(Instrumental)-Prod.-by-Pete-Rock-Scratches-by-J-Live.mp3', isPlaying: false, isRecording: false },
    { id: 171, name: 'Beat 171', url: 'https://www.gadgetchespaccano.it/HipHop/Instrumental-Rap-Beat-5-Gangsta.mp3', isPlaying: false, isRecording: false },
    { id: 172, name: 'Beat 172', url: 'https://www.gadgetchespaccano.it/HipHop/Instrumental---Made-You-Look.mp3', isPlaying: false, isRecording: false },
    { id: 173, name: 'Beat 173', url: 'https://www.gadgetchespaccano.it/HipHop/Insight---True-to-the-Game-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 174, name: 'Beat 174', url: 'https://www.gadgetchespaccano.it/HipHop/Immortal-90s-Boombap-HipHopBeat.mp3', isPlaying: false, isRecording: false },
    { id: 175, name: 'Beat 175', url: 'https://www.gadgetchespaccano.it/HipHop/INSPIRAME---Instrumental-de-RAPOld-School-2017-FREE-USE---USO-LIBRE.mp3', isPlaying: false, isRecording: false },
    { id: 176, name: 'Beat 176', url: 'https://www.gadgetchespaccano.it/HipHop/ILLstrumentals_-_Soulful_90s_Old_School_Rap_Beat_Hip_Hop_Instrumental_2015_-_Im_Gone.mp3', isPlaying: false, isRecording: false },
    { id: 177, name: 'Beat 177', url: 'https://www.gadgetchespaccano.it/HipHop/ICE---DARK-OLD-SCHOOL-90S-BOOM-BAP-INSTRUMENTAL-(SOLD).mp3', isPlaying: false, isRecording: false },
    { id: 178, name: 'Beat 178', url: 'https://www.gadgetchespaccano.it/HipHop/Hip-Hop-Rap-Beat-Instrumental-Chill-High-Slow.mp3', isPlaying: false, isRecording: false },
    { id: 179, name: 'Beat 179', url: 'https://www.gadgetchespaccano.it/HipHop/Hip-Hop-FreeStyle-Instrumental.-FreeStyle-Rap-Beat.-Rap-Instrumental.-FreeStyle-Rap-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 180, name: 'Beat 180', url: 'https://www.gadgetchespaccano.it/HipHop/Guru---Watch-What-You-Say-(DJ-Premier-Instrumental)-(1995)-[HQ].mp3', isPlaying: false, isRecording: false },
    { id: 181, name: 'Beat 181', url: 'https://www.gadgetchespaccano.it/HipHop/Ghostface-Killah--Box-In-Hand-Intro-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 182, name: 'Beat 182', url: 'https://www.gadgetchespaccano.it/HipHop/Gangster-beat---Instrumental-(Hip-Hop)-produce-by-mh-recordz.mp3', isPlaying: false, isRecording: false },
    { id: 183, name: 'Beat 183', url: 'https://www.gadgetchespaccano.it/HipHop/Gang-Starr---Natural-(Instrumental)-(2002)-[HQ].mp3', isPlaying: false, isRecording: false },
    { id: 184, name: 'Beat 184', url: 'https://www.gadgetchespaccano.it/HipHop/Gang-Starr---Mass-Appeal-[Instrumental]-(Produced-by-DJ-Premier).mp3', isPlaying: false, isRecording: false },
    { id: 185, name: 'Beat 185', url: 'https://www.gadgetchespaccano.it/HipHop/GZA---4th-Chamber-(instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 186, name: 'Beat 186', url: 'https://www.gadgetchespaccano.it/HipHop/GTA-San-Andreas-Instrumental-Theme.mp3', isPlaying: false, isRecording: false },
    { id: 187, name: 'Beat 187', url: 'https://www.gadgetchespaccano.it/HipHop/GTA-IV-Theme-Song-(Music).mp3', isPlaying: false, isRecording: false },
    { id: 188, name: 'Beat 188', url: 'https://www.gadgetchespaccano.it/HipHop/Freestyle_Rap-Beat---Stunna.mp3', isPlaying: false, isRecording: false },
    { id: 189, name: 'Beat 189', url: 'https://www.gadgetchespaccano.it/HipHop/FREE-90\'S-BOOM-BAP-HIP-HOP-INSTRUMENTAL-BEAT---DOSHA.mp3', isPlaying: false, isRecording: false },
    { id: 190, name: 'Beat 190', url: 'https://www.gadgetchespaccano.it/HipHop/FL-Rap-Beat---Angry-Violins.mp3', isPlaying: false, isRecording: false },
    { id: 191, name: 'Beat 191', url: 'https://www.gadgetchespaccano.it/HipHop/Evidence---Audible-Angels-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 192, name: 'Beat 192', url: 'https://www.gadgetchespaccano.it/HipHop/Esta-es-mi-historia---Hip-Hop-Instrumental-GRATIS-(IduBetas-Prod).mp3', isPlaying: false, isRecording: false },
    { id: 193, name: 'Beat 193', url: 'https://www.gadgetchespaccano.it/HipHop/Edo-G---Pay-The-Price-(Instrumental)-Pete-Rock.mp3', isPlaying: false, isRecording: false },
    { id: 194, name: 'Beat 194', url: 'https://www.gadgetchespaccano.it/HipHop/Eazy-E---Switchez-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 195, name: 'Beat 195', url: 'https://www.gadgetchespaccano.it/HipHop/EPMD---So-What-Cha-Sayin-(Original-Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 196, name: 'Beat 196', url: 'https://www.gadgetchespaccano.it/HipHop/Dr.Octagon-Tricknology-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 197, name: 'Beat 197', url: 'https://www.gadgetchespaccano.it/HipHop/Dr.Octagon-No-Awareness-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 198, name: 'Beat 198', url: 'https://www.gadgetchespaccano.it/HipHop/Dr.Octagon-Girl-Let-Me-Touch-You-Instrumental.wmv.mp3', isPlaying: false, isRecording: false },
    { id: 199, name: 'Beat 199', url: 'https://www.gadgetchespaccano.it/HipHop/Dr.-Dooom---Surgery-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 200, name: 'Beat 200', url: 'https://www.gadgetchespaccano.it/HipHop/Doubletime-Freebeat.mp3', isPlaying: false, isRecording: false },
    { id: 201, name: 'Beat 201', url: 'https://www.gadgetchespaccano.it/HipHop/Dope-Freestyle-Hip-Hop-beat-(Boom-Bap).Eldizzle.mp3', isPlaying: false, isRecording: false },
    { id: 202, name: 'Beat 202', url: 'https://www.gadgetchespaccano.it/HipHop/Dope-Classic-Old-School-Hip-Hop-Beat-Notorious-B.I.G.-Type-Rap-Instrumental-Crooklyn.mp3', isPlaying: false, isRecording: false },
    { id: 203, name: 'Beat 203', url: 'https://www.gadgetchespaccano.it/HipHop/Diabolical-Prophets-Underground-Instrumental-beats-2.mp3', isPlaying: false, isRecording: false },
    { id: 204, name: 'Beat 204', url: 'https://www.gadgetchespaccano.it/HipHop/Das-efx---Real-hip-hop-(instrumental.-premier).mp3', isPlaying: false, isRecording: false },
    { id: 205, name: 'Beat 205', url: 'https://www.gadgetchespaccano.it/HipHop/Dark-Epic-HipHop-Beat.mp3', isPlaying: false, isRecording: false },
    { id: 206, name: 'Beat 206', url: 'https://www.gadgetchespaccano.it/HipHop/Damaged(Instrumental)-Ol\'-Dirty-Bastard.mp3', isPlaying: false, isRecording: false },
    { id: 207, name: 'Beat 207', url: 'https://www.gadgetchespaccano.it/HipHop/DS-Beatz-Angry-Dark-Hard-Rap-Beat-2016.mp3', isPlaying: false, isRecording: false },
    { id: 208, name: 'Beat 208', url: 'https://www.gadgetchespaccano.it/HipHop/DJ-Premier---Watch-Your-Back-(instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 209, name: 'Beat 209', url: 'https://www.gadgetchespaccano.it/HipHop/DJ-Premier---The-Squeeze-(instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 210, name: 'Beat 210', url: 'https://www.gadgetchespaccano.it/HipHop/DJ-Premier---The-Piece-Maker-(instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 211, name: 'Beat 211', url: 'https://www.gadgetchespaccano.it/HipHop/DJ-Premier---The-Bullshit-(instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 212, name: 'Beat 212', url: 'https://www.gadgetchespaccano.it/HipHop/DJ-Premier---Teach-the-Children-(instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 213, name: 'Beat 213', url: 'https://www.gadgetchespaccano.it/HipHop/DJ-Premier---Seen-it-All-(instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 214, name: 'Beat 214', url: 'https://www.gadgetchespaccano.it/HipHop/DJ-Premier---Sayin\'-Somethin\'-(instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 215, name: 'Beat 215', url: 'https://www.gadgetchespaccano.it/HipHop/DJ-Premier---Pee-An-Ho.mp3', isPlaying: false, isRecording: false },
    { id: 216, name: 'Beat 216', url: 'https://www.gadgetchespaccano.it/HipHop/DJ-Premier---Next-Level-nyte-tyme-remix-(instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 217, name: 'Beat 217', url: 'https://www.gadgetchespaccano.it/HipHop/DJ-Premier---Just-remix-(instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 218, name: 'Beat 218', url: 'https://www.gadgetchespaccano.it/HipHop/Common---The-Questions-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 219, name: 'Beat 219', url: 'https://www.gadgetchespaccano.it/HipHop/Common---The-Concept-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 220, name: 'Beat 220', url: 'https://www.gadgetchespaccano.it/HipHop/Common---The-Bitch-In-You-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 221, name: 'Beat 221', url: 'https://www.gadgetchespaccano.it/HipHop/Common---1999-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 222, name: 'Beat 222', url: 'https://www.gadgetchespaccano.it/HipHop/Clipse-ft-Pharrell--Mr-me-Too-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 223, name: 'Beat 223', url: 'https://www.gadgetchespaccano.it/HipHop/Chino-XL---Waiting-To-Exhale-(Instrumental)-(1995)-[HQ].mp3', isPlaying: false, isRecording: false },
    { id: 224, name: 'Beat 224', url: 'https://www.gadgetchespaccano.it/HipHop/Chino-XL---No-Complex-(Instrumental)-(1995)-[HQ].mp3', isPlaying: false, isRecording: false },
    { id: 225, name: 'Beat 225', url: 'https://www.gadgetchespaccano.it/HipHop/Chill-Blunted-Hip-Hop-Beat-Dope-Sounding.mp3', isPlaying: false, isRecording: false },
    { id: 226, name: 'Beat 226', url: 'https://www.gadgetchespaccano.it/HipHop/CNN---Invincible-(instrumental.-premier).mp3', isPlaying: false, isRecording: false },
    { id: 227, name: 'Beat 227', url: 'https://www.gadgetchespaccano.it/HipHop/Busta-Rhymes-Feat.-Pharrell---Light-Your-Ass-On-Fire-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 228, name: 'Beat 228', url: 'https://www.gadgetchespaccano.it/HipHop/Black-Moon-Who-Got-Da-Props-(instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 229, name: 'Beat 229', url: 'https://www.gadgetchespaccano.it/HipHop/Black-Moon-Black-Smif-N-Wessun-(Instrumental).mp3', isPlaying: false, isRecording: false },
    { id: 230, name: 'Beat 230', url: 'https://www.gadgetchespaccano.it/HipHop/Instrumental-Beat2018.mp3', isPlaying: false, isRecording: false },
    { id: 231, name: 'Beat 231', url: 'https://www.gadgetchespaccano.it/HipHop/trap.mp3', isPlaying: false, isRecording: false },
    { id: 232, name: 'Beat 232', url: 'https://www.gadgetchespaccano.it/HipHop/trap2.mp3', isPlaying: false, isRecording: false },
    { id: 233, name: 'Beat 233', url: 'https://www.gadgetchespaccano.it/trap/beat15.mp3', isPlaying: false, isRecording: false },
    { id: 234, name: 'Beat 234', url: 'https://www.gadgetchespaccano.it/trap/beat16.mp3', isPlaying: false, isRecording: false },
    { id: 235, name: 'Beat 235', url: 'https://www.gadgetchespaccano.it/trap/beat17.mp3', isPlaying: false, isRecording: false },
    { id: 236, name: 'Beat 236', url: 'https://www.gadgetchespaccano.it/trap/beat18.mp3', isPlaying: false, isRecording: false },
    { id: 237, name: 'Beat 237', url: 'https://www.gadgetchespaccano.it/trap/beat19.mp3', isPlaying: false, isRecording: false },
    { id: 238, name: 'Beat 238', url: 'https://www.gadgetchespaccano.it/trap/beat20.mp3', isPlaying: false, isRecording: false },
    { id: 239, name: 'Beat 239', url: 'https://www.gadgetchespaccano.it/trap/beat4.mp3', isPlaying: false, isRecording: false },
    { id: 240, name: 'Beat 240', url: 'https://www.gadgetchespaccano.it/trap/beat5.mp3', isPlaying: false, isRecording: false },
    { id: 241, name: 'Beat 241', url: 'https://www.gadgetchespaccano.it/trap/beat6.mp3', isPlaying: false, isRecording: false },
    { id: 242, name: 'Beat 242', url: 'https://www.gadgetchespaccano.it/trap/beat7.mp3', isPlaying: false, isRecording: false },
    { id: 243, name: 'Beat 243', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/J-Dilla---Don%27t-Say-A-Word-%282001%29.mp3', isPlaying: false, isRecording: false },
    { id: 244, name: 'Beat 244', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/J-Dilla---Life-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 245, name: 'Beat 245', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/J-Dilla---Show-Me-What-You-Got-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 246, name: 'Beat 246', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/J-Dilla---Rip-off-the-Roof.mp3', isPlaying: false, isRecording: false },
    { id: 247, name: 'Beat 247', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Kardinal-Offishall---Ol%27-Time-Killin%27-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 248, name: 'Beat 248', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Killarmy---Feel-It-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 249, name: 'Beat 249', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/L%27ind%C3%A9cis---Blind.mp3', isPlaying: false, isRecording: false },
    { id: 250, name: 'Beat 250', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/L%27inde%CC%81cis---Soulful.mp3', isPlaying: false, isRecording: false },
    { id: 251, name: 'Beat 251', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Ludacris-Ft-Jermaine-Dupri-Welcome-to-Atlanta-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 252, name: 'Beat 252', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/LL-Cool-J-Phenomenon-instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 253, name: 'Beat 253', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Ludacris-Stand-up-instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 254, name: 'Beat 254', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/J-Dilla---Rip-off-the-Roof.mp3', isPlaying: false, isRecording: false },
    { id: 255, name: 'Beat 255', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Mannish---Mannish-%28instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 256, name: 'Beat 256', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Massinfluence---Clown-Syndrome-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 257, name: 'Beat 257', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Mase-ft-Total-What-You-Want-instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 258, name: 'Beat 258', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Massinfluence---Life-To-The-MC-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 259, name: 'Beat 259', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Mass-Influence---Nonsense-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 260, name: 'Beat 260', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Mass-Influence---Space-Cases-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 261, name: 'Beat 261', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Mass-Influence-Rhyme-Placement-Instrumental-1998-HQ.mp3', isPlaying: false, isRecording: false },
    { id: 262, name: 'Beat 262', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Mass-Influence---Under-Pressure-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 263, name: 'Beat 263', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Miilkbone---Keep-It-Real-Instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 264, name: 'Beat 264', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Mind-Power-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 265, name: 'Beat 265', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Mystikal-Danger-%7BInstrumental%7D.mp3', isPlaying: false, isRecording: false },
    { id: 266, name: 'Beat 266', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Mobb-Deep---Temperature%27s-Rising-%28Remix-Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 267, name: 'Beat 267', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Necro---Black-Helicopters-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 268, name: 'Beat 268', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Nas---One-Love-%28Instrumental%29-%5BTrack-7%5D.mp3', isPlaying: false, isRecording: false },
    { id: 269, name: 'Beat 269', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/People-without-Shoes---Green-Shoe-Laces-%28Instrumental%29-%281994%29.mp3', isPlaying: false, isRecording: false },
    { id: 270, name: 'Beat 270', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Q-Tip---Let%27s-Ride-%28Instrumental-J-Dilla%29.mp3', isPlaying: false, isRecording: false },
    { id: 271, name: 'Beat 271', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Q-Tip-We-Fight-We-Love-remix-instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 272, name: 'Beat 272', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Reckanize---Mr.-Sta-Puff---Hip-Hop-Don%27t-Stop-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 273, name: 'Beat 273', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Sic-Sense---Positional-Bypass-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 274, name: 'Beat 274', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/The-Beatnuts---Relax-Yourself.mp3', isPlaying: false, isRecording: false },
    { id: 275, name: 'Beat 275', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Slum-Village---Once-Upon-a-Time-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 276, name: 'Beat 276', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/The-Crooklyn-Dodgers---Crooklyn-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 277, name: 'Beat 277', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/The-Concept-Of-Alps---Intensity-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 278, name: 'Beat 278', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/The-Fab-5---Leflaur-Leflah-Eshkoshka-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 279, name: 'Beat 279', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/The-Fugees----Fu-Gee-La--%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 280, name: 'Beat 280', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/The-Roots-Duck-Down-instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 281, name: 'Beat 281', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/The-Roots-Duck-Down-instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 282, name: 'Beat 282', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/The-Roots-Stay-Cool-instrumental.mp3', isPlaying: false, isRecording: false },
    { id: 283, name: 'Beat 283', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Tupac---I-Get-Around-Instrumental-%2B-Piano-Intro.mp3', isPlaying: false, isRecording: false },
    { id: 284, name: 'Beat 284', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Thrust---Emcee-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 285, name: 'Beat 285', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/I-Power---Free-Da-Dome-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 286, name: 'Beat 286', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Visionaries---V-Peat-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 287, name: 'Beat 287', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Jay-Dee-02.mp3', isPlaying: false, isRecording: false },
    { id: 288, name: 'Beat 288', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Jay-Dee-03.mp3', isPlaying: false, isRecording: false },
    { id: 289, name: 'Beat 289', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Jay-Dee-14.mp3', isPlaying: false, isRecording: false },
    { id: 290, name: 'Beat 290', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/Jay-Dee---Track-52.mp3', isPlaying: false, isRecording: false },
    { id: 291, name: 'Beat 291', url: 'https://www.gadgetchespaccano.it/HipHop/new2019/J-Dilla-%28Jay-Dee%29---Bullshit-%28Instrumental%29.mp3', isPlaying: false, isRecording: false },
    { id: 292, name: 'Beat 292', url: 'https://www.gadgetchespaccano.it/trap/beat10.mp3', isPlaying: false, isRecording: false },
    { id: 293, name: 'Beat 293', url: 'https://www.gadgetchespaccano.it/trap/beat11.mp3', isPlaying: false, isRecording: false },
    { id: 294, name: 'Beat 294', url: 'https://www.gadgetchespaccano.it/trap/beat12.mp3', isPlaying: false, isRecording: false },
    { id: 295, name: 'Beat 295', url: 'https://www.gadgetchespaccano.it/trap/beat13.mp3', isPlaying: false, isRecording: false },
    { id: 296, name: 'Beat 296', url: 'https://www.gadgetchespaccano.it/trap/beat14.mp3', isPlaying: false, isRecording: false },
    { id: 297, name: 'Beat 297', url: 'https://www.gadgetchespaccano.it/trap/trap10.mp3', isPlaying: false, isRecording: false },
    { id: 298, name: 'Beat 298', url: 'https://www.gadgetchespaccano.it/trap/trap9.mp3', isPlaying: false, isRecording: false },

  ];	
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
    // Traccia l'evento con il servizio
    await this.FirebaseAnalytics.logEvent('page_view', { page: 'home' });
    this.initializeApp();
    console.log('Component initialized');
    await this.initializeRecorder();
    this.setupAudioEventListeners();
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