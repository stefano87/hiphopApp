  import { Injectable } from '@angular/core';
  import { Preferences } from '@capacitor/preferences';
  import { Platform } from '@ionic/angular';
  import { BehaviorSubject, Observable } from 'rxjs';
  interface Beat {
    id: number;
    name: string;
    url: string;
    isPlaying?: boolean;
    isRecording: boolean;
  }
  @Injectable({
    providedIn: 'root'
  })
  export class FavoritesService {
    private STORAGE_KEY = 'favorites';
    private favoritesSubject = new BehaviorSubject<Beat[]>([]);
    favorites$ = this.favoritesSubject.asObservable();
    
    constructor(private platform: Platform) {
      this.loadFavorites();
    }

    private async loadFavorites() {
      try {
        let favorites: Beat[] = [];
        if (this.platform.is('capacitor')) {
          const { value } = await Preferences.get({ key: this.STORAGE_KEY });
          favorites = value ? JSON.parse(value) : [];
        } else {
          const value = localStorage.getItem(this.STORAGE_KEY);
          favorites = value ? JSON.parse(value) : [];
        }
        this.favoritesSubject.next(favorites);
      } catch (error) {
        console.error('[FavoritesService] Errore nel caricamento dei preferiti:', error);
        this.favoritesSubject.next([]);
      }
    }

    getFavorites(): Observable<Beat[]> {
      return this.favorites$;
    }

    getCurrentFavorites(): Beat[] {
      return this.favoritesSubject.value;
    }

    private resetBeatState(beat: Beat): Beat {
      return {
        ...beat,
        isPlaying: false,
        isRecording: false
      };
    }

    async saveFavorites(favorites: Beat[]): Promise<void> {
      try {
        const resettedFavorites = favorites.map(beat => this.resetBeatState(beat));
        const jsonValue = JSON.stringify(resettedFavorites);
        
        if (this.platform.is('capacitor')) {
          await Preferences.set({
            key: this.STORAGE_KEY,
            value: jsonValue
          });
        } else {
          localStorage.setItem(this.STORAGE_KEY, jsonValue);
        }
        
        // Aggiorna il BehaviorSubject
        this.favoritesSubject.next(resettedFavorites);
      } catch (error) {
        console.error('[FavoritesService] Errore nel salvataggio dei preferiti:', error);
        throw error;
      }
    }

    async toggleFavorite(beat: Beat): Promise<void> {
      try {
        const currentFavorites = this.favoritesSubject.value;
        const isFav = currentFavorites.some(fav => fav.id === beat.id);
        
        let updatedFavorites: Beat[];
        if (isFav) {
          updatedFavorites = currentFavorites.filter(fav => fav.id !== beat.id);
        } else {
          // Reset the beat state before adding to favorites
        const resetBeat = this.resetBeatState(beat);
        updatedFavorites = [...currentFavorites, resetBeat];
        }
        
        await this.saveFavorites(updatedFavorites);
      } catch (error) {
        console.error('[FavoritesService] Errore nel toggle dei preferiti:', error);
        throw error;
      }
    }
  }