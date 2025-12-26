import { TaskEntity } from './entities/task.entity';

export function mapTaskToEntity(task: any): TaskEntity {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        done: task.done,
        userId: task.userId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
    };
}
