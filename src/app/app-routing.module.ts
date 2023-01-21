import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/compat/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['']);

import { APP_ROUTES } from './app.routes';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/tasks-dashboard/tasks-dashboard.module').then((m) => m.TasksDashboardModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: APP_ROUTES.LOGIN,
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
    ...canActivate(redirectLoggedInToItems),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
