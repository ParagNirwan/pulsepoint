import { Routes } from '@angular/router';
import { Signup } from './pages/signup/signup';
import { Login } from './pages/login/login';
import { UserSettingsComponent } from './pages/user-setting/user-setting';
import { Feed } from './pages/feed/feed';
import { AuthGuard } from './auth/auth.guard';


export const routes: Routes = [
    { path: '', redirectTo: 'feed', pathMatch: 'full' },
    { path: 'signup', component: Signup },
    { path: 'login', component: Login },
    { path: 'user-settings', component: UserSettingsComponent, canActivate: [AuthGuard] },
    { path: 'feed', component: Feed, canActivate: [AuthGuard] }
];
