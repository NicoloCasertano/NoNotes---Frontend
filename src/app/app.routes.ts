import { HttpClient } from '@angular/common/http';
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserPage } from './components/user-page/user-page';
import { LogInArea } from './components/log-in-area/log-in-area';
import { LogOut } from './components/log-out/log-out';
import { RegisterAreaComponent } from './components/register-area/register-area';
import { Admin } from './components/admin/admin';
import { BeatDetails } from './components/details-component/beat-details/beat-details';
import { WorkDetails } from './components/details-component/work-details/work-details';
import { ListeningArea } from './components/listening-area/listening-area';
import { UploadWork } from './components/upload-work/upload-work';

export const routes: Routes = [{ path: '', redirectTo: 'log-in-area', pathMatch: 'full'},
    { path: 'log-in-area', loadComponent: () => import('./components/log-in-area/log-in-area').then(m => m.LogInArea)},
    { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
    { path: 'user/:id', loadComponent: () => import('./components/user-page/user-page').then(m => m.UserPage) },
    { path: 'log-out', loadComponent: () => import('./components/log-out/log-out').then(m => m.LogOut) },
    { path: 'register-area', loadComponent: () => import('./components/register-area/register-area').then(m => m.RegisterAreaComponent) },
    { path: 'admin', loadComponent: () => import('./components/admin/admin').then(m => m.Admin)},
    { path: 'beat-details/:id', loadComponent: () => import('./components/details-component/beat-details/beat-details').then(m => m.BeatDetails)},
    { path: 'work-details/:id', loadComponent: () => import('./components/details-component/work-details/work-details').then(m => m.WorkDetails)},
    { path: 'listening-area', loadComponent: () => import('./components/listening-area/listening-area').then(m => m.ListeningArea)},
    { path: 'upload-work', loadComponent: () => import('./components/upload-work/upload-work').then(m => m.UploadWork)},
    { path: 'work-list', loadComponent: () => import('./components/home-lists/work-list/work-list').then(m => m.WorkList)},
    { path: 'beat-list', loadComponent: () => import('./components/home-lists/beat-list/beat-list').then(m => m.BeatList)}
    
];
