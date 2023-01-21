import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormArray,
  FormGroup,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task, TaskActivity, TaskStatus, User, UserRef } from '@firetasks/models';
import { TaskService } from '../../../../core/services/task-service/task.service';
import { Observable } from 'rxjs';
import { UserService } from '../../../../core/services/user-service/user.service';

export interface DialogData {
  task: Task;
  userId?: string;
}

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
})
export class TaskDialogComponent implements OnInit {

  isLoading = false;
  taskForm: UntypedFormGroup;
  task: Task = this.data.task;
  users$?: Observable<User[]>;
  createTaskModel = '';

  get isOwner() {
    return this.data.userId && this.data.userId === this.task.owner.id;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    private formBuilder: UntypedFormBuilder,
    private taskService: TaskService,
    private userService: UserService,
  ) {
    this.taskForm = this.formBuilder.group({
      title: [this.task.title || '', Validators.required],
      status: [this.task.status || TaskStatus.TODO, Validators.required],
      activities: new FormArray(this.generatedActivitiesControls),
    });
  }

  get generatedActivitiesControls(): Array<FormGroup> {
    if (!this.task.activities) {
      return [];
    }
    return this.task.activities.map(activity => this.formBuilder.group({
      title: [activity.title],
      assignee: [{value: activity.assignee || null, disabled: !this.isOwner || activity.isCompleted}],
      isCompleted: [{value: activity.isCompleted || false, disabled: activity.isCompleted || !activity.assignee || activity.assignee.id !== this.data.userId}],
    }));
  }

  ngOnInit(): void {
    this.users$ = this.userService.subscribeToUsers();
    this.beforeDialogClosedSubscription();
  }

  save(): void {
    if (!this.taskForm.get('title')?.value) {
      return;
    }
    this.isLoading = true;
    this.task = this.task.copyWith({
      ...this.taskForm.getRawValue(),
      updatedAt: new Date(),
    });

    this.taskService.save(this.task).finally(() => {
      this.isLoading = false;
    }).catch(console.error);
  }

  removeTaskItem(index: number): void {
    this.activitiesFormArray.removeAt(index);
  }

  createNewTask(): void {
    this.activitiesFormArray.insert(0, this.formBuilder.group({
      title: [this.createTaskModel],
      assignee: [null],
      isCompleted: [],
    }));
    this.createTaskModel = '';
  }

  get activitiesFormArray(): FormArray {
    return this.taskForm.get('activities') as FormArray;
  }

  getUserRef(user: User): UserRef {
    return {
      id: user.id,
      name: user.name,
    }
  }

  objectComparisonFunction(option: UserRef, value: UserRef): boolean {
    return option && value && option.id === value.id;
  }

  cancel(): void {
    this.taskForm.reset();
  }

  delete(): void {
    this.isLoading = true;
    this.taskService.delete(this.task).finally(() => {
      this.isLoading = false;
      this.dialogRef.close();
    }).catch(console.error);
  }

  private beforeDialogClosedSubscription(): void {
    this.dialogRef.beforeClosed().subscribe(() => {
      return this.save();
    });
  }
}
