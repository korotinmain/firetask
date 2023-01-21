import { TaskModel } from '@firetasks/models';

export interface TasksGrouped {
  [key: string]: TaskList;
}
export interface TaskList {
  label: string;
  status: string;
  order: number;
  tasks: TaskModel[];
}
