import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TasksDashboardComponent } from './tasks-dashboard/tasks-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: TasksDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
