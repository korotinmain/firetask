import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Task } from '@firetasks/models';

import { TaskService, TaskList } from '../services/task.service';
import { TaskDialogComponent } from './task-dialog.component';

@Component({
  selector: 'app-tasks-dashboard',
  templateUrl: './tasks-dashboard.component.html',
  styleUrls: ['./tasks-dashboard.component.scss']
})
export class TasksDashboardComponent implements OnInit {
  taskLists$?: Observable<TaskList[]>;

  constructor(
    private dialog: MatDialog,
    private taskService: TaskService,
  ) { }

  ngOnInit() {
    this.taskLists$ = this.taskService.subscribeToTasks();
  }

  showTaskDetail(task: Task) {
    console.log('showTaskDetail', task);
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '450px',
      height: '600px',
      data: { task },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}
