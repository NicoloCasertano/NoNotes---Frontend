import { Routes } from '@angular/router';
import { RoleGuard } from './components/role-guard/role-guard';

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
    { path: 'upload-work', loadComponent: () => import('./components/upload-work/upload-work').then(m => m.UploadWork), canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'] } },
    { path: 'work-list', loadComponent: () => import('./components/home-lists/work-list/work-list').then(m => m.WorkList)},
    { path: 'beat-list', loadComponent: () => import('./components/home-lists/beat-list/beat-list').then(m => m.BeatList)},
    
];
