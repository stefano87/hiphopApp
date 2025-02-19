import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tab1', // Redireziona alla pagina del primo tab
    pathMatch: 'full',
  },
  {
    path: 'tab1',
    loadComponent: () => import('./beat-list/beat-list.component').then((m) => m.BeatListComponent),
  },
  {
    path: 'tab2',
    loadComponent: () => 
      import('./favorites/favorites.component').then((m) => m.FavoritesComponent),
  },
  {
    path: 'tab3',
    loadComponent: () => 
      import('./community/community.component').then((m) => m.CommunityComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./community/community.component').then( m => m.CommunityComponent)
  }
];

