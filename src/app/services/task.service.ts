import { first, groupBy, mapValues } from 'lodash';
import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { TaskModel, TaskStatus } from '@firetasks/models';
import { map, tap } from 'rxjs/operators';

export interface TasksGrouped {
  [key: string]: TaskList;
}
export interface TaskList {
  label: string;
  order: number;
  tasks: TaskModel[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private firestore: Firestore) {}

  subscribeToTasks() {
    return collectionData(collection(this.firestore, 'tasks')).pipe(
      map((data) => data.map((item) => TaskModel.fromFirestore(item))),
      map((tasks) => groupBy(tasks, 'status')),
      map((tasksByStatus) => mapValues(tasksByStatus, (tasks, status) => ({
        ...this.getStatusInfo(status),
        tasks,
      })) as TasksGrouped),
      map((tasksGrouped) => Object.values(tasksGrouped).sort((a, b) => a.order - b.order)),
    );
  }

  private getStatusInfo(statusEnum: string) {
    switch (statusEnum) {
      case TaskStatus.TODO:
        return {label: 'To do', order: 0};
      case TaskStatus.IN_PROGRESS:
        return {label: 'In progress', order: 1};
      case TaskStatus.DONE:
        return {label: 'Done', order: 2};
      default:
        return null;
    }
  }
}
