import { RouterModule, Routes } from '@angular/router';
import { TasksDashboardComponent } from './pages/tasks-dashboard/tasks-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: TasksDashboardComponent,
  },
];

export const TasksDashboardRouting = RouterModule.forChild(routes);
