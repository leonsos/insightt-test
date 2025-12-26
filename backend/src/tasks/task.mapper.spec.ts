import { mapTaskToEntity } from './task.mapper';

describe('TaskMapper', () => {
    it('should map a raw task object to a TaskEntity', () => {
        const rawTask = {
            id: 1,
            title: 'Test Task',
            description: 'Test Description',
            done: false,
            userId: 123,
            createdAt: new Date('2025-01-01'),
            updatedAt: new Date('2025-01-02'),
            extraField: 'should be ignored'
        };

        const entity = mapTaskToEntity(rawTask);

        expect(entity).toEqual({
            id: 1,
            title: 'Test Task',
            description: 'Test Description',
            done: false,
            userId: 123,
            createdAt: rawTask.createdAt,
            updatedAt: rawTask.updatedAt,
        });

        // ensure extra fields are not included if the type is strict, 
        // though JS objects will just have the properties assigned.
        // We verify the output object structure indirectly via toEqual.
    });

    it('should map a task without description correctly', () => {
        const rawTask = {
            id: 2,
            title: 'Task without Desc',
            done: true,
            userId: 456,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const entity = mapTaskToEntity(rawTask);
        expect(entity.description).toBeUndefined();
        expect(entity.title).toBe('Task without Desc');
    });
});
