export class TaskEntity {
  id: number;
  title: string;
  description?: string;
  done: boolean;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}