export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface Task {
  title: string;
  checklist?: string[];
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;

  toFirestore(): any;
}

export class TaskModel implements Task {
  title: string = '';
  checklist?: string[] = [];
  status = TaskStatus.TODO;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Task>) {
    this.createdAt = this.updatedAt = data.createdAt || new Date();

    // TODO: remove this as soon as checklist are propery implemented
    delete data.checklist;

    Object.assign(this, data);
  }

  static fromFirestore(data: any): Task {
    return new TaskModel({
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    });
  }

  toFirestore() {
    return { ...this };
  }
}
