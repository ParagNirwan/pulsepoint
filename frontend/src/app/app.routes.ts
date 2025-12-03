import { Routes } from '@angular/router';
import { Signup } from './pages/signup/signup';
import { Login } from './pages/login/login';
import { UserSettingsComponent } from './pages/user-setting/user-setting';
import { Feed } from './pages/feed/feed';
import { AuthGuard } from './auth/auth.guard';
import { Bookmarks } from './pages/bookmarks/bookmarks';
import { LikedNews } from './pages/liked-news/liked-news';
import { SidenavComponent } from './components/sidenav/sidenav';

export const routes: Routes = [
    { path: 'signup', component: Signup },
    { path: 'login', component: Login },

    // Sidenav is layout container for authenticated pages
    {
        path: '',
        component: SidenavComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'feed', pathMatch: 'full' },
            { path: 'feed', component: Feed },
            { path: 'bookmarks', component: Bookmarks },
            { path: 'liked-news', component: LikedNews },
            { path: 'user-settings', component: UserSettingsComponent }
        ]
    },

    // fallback
    { path: '**', redirectTo: '' }
];
