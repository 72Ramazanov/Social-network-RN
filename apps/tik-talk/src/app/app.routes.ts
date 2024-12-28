import { Routes } from '@angular/router';

import { LayoutComponent } from '@tt/layout';
import { LoginPageComponent, canActivateAuth } from '@tt/auth';
import { chatsRoutes } from '@tt/chats';
import {
  ProfilePageComponent,
  SearchPageComponent,
  SettingsPageComponent,
  ProfileFeature,
  ProfileEffects
} from '@tt/profile';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { PostEffects, PostFeature } from '@tt/posts';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      { path: 'profile/:id', component: ProfilePageComponent,
        providers: [
          provideState(PostFeature),
          provideEffects(PostEffects)
        ]
       },
      { path: 'settings', component: SettingsPageComponent },
      { path: 'search', component: SearchPageComponent,
        providers: [
          provideState(ProfileFeature),
          provideEffects(ProfileEffects)
        ]
       },
      {
        path: 'chats',
        loadChildren: () => chatsRoutes,
      },
    ],
    canActivate: [canActivateAuth],
  },
  { path: 'login', component: LoginPageComponent },
];
