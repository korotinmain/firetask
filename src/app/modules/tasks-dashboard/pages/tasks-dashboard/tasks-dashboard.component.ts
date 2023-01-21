import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Task, TaskModel, TaskStatus } from '@firetasks/models';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { TaskList } from '../../../../core/models/tasks.interface';
import { TaskService } from '../../../../core/services/task-service/task.service';
import { TaskDialogComponent } from '../../dialogs/task-dialog/task-dialog.component';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tasks-dashboard',
  templateUrl: './tasks-dashboard.component.html',
  styleUrls: ['./tasks-dashboard.component.scss'],
})
export class TasksDashboardComponent implements OnInit {
  taskLists$?: Observable<TaskList[]>;
  user?: { uid: string, displayName?: string };

  constructor(
    private dialog: MatDialog,
    private auth: AngularFireAuth,
    private taskService: TaskService,
  ) {
  }

  ngOnInit() {
    this.auth.currentUser.then(user => this.user = user as any);
    this.taskLists$ = this.taskService.subscribeToTasks();
  }

  async addNewTask(status: string) {
    this.dialog.open(TaskDialogComponent, {
      width: '450px',
      height: '600px',
      data: {
        task: new TaskModel({
          status: status as TaskStatus,
          owner: {
            id: this.user!.uid,
            name: this.user!.displayName!,
          },
        }),
        userId: this.user?.uid,
      },
    });
  }

  showTaskDetail(task: Task): void {
    // console.log('showTaskDetail', task);
    this.dialog.open(TaskDialogComponent, {
      width: '550px',
      height: '800px',
      data: {
        task,
        userId: this.user?.uid,
      },
    });

    // dialogRef.afterClosed().subscribe(() => {
    //   console.log('The dialog was closed');
    // });
  }

  getListStatusId(status: string): string {
    return status.toLowerCase();
  }

  drop(event: CdkDragDrop<TaskModel[]>): void {
    const item = event.previousContainer.data[event.previousIndex];
    const status: TaskStatus = event.container.id as TaskStatus;
    this.taskService.save(item.copyWith({status})).then();
  }
}
