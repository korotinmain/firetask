import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksDashboardComponent } from './pages/tasks-dashboard/tasks-dashboard.component';
import { TaskDialogComponent } from './dialogs/task-dialog/task-dialog.component';
import { TasksDashboardRouting } from './tasks-dashboard.routing';
import { EditableModule } from '@ngneat/edit-in-place';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    TasksDashboardComponent,
    TaskDialogComponent,
  ],
  imports: [
    CommonModule,
    TasksDashboardRouting,
    EditableModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    DragDropModule,
  ],
})
export class TasksDashboardModule {
}
