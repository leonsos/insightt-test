import api from './api';

export interface Task {
    id: number;
    title: string;
    description?: string;
    done: boolean;
    createdAt: string;
}

export interface CreateTaskDto {
    title: string;
    description?: string;
}

export interface UpdateTaskDto {
    title?: string;
    description?: string;
    done?: boolean;
}

export const TasksService = {
    getAll: async (): Promise<Task[]> => {
        const response = await api.get('/tasks');
        return response.data;
    },

    create: async (data: CreateTaskDto): Promise<Task> => {
        const response = await api.post('/tasks', data);
        return response.data;
    },

    update: async (id: number, data: UpdateTaskDto): Promise<Task> => {
        const response = await api.patch(`/tasks/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/tasks/${id}`);
    },

    markAsDone: async (id: number): Promise<Task> => {
        // Usar Cloud Function desplegada para esta "feature especial"
        const cloudFunctionUrl = import.meta.env.VITE_CLOUD_FUNCTION_URL;

        // Obtenemos el token directamente porque 'api' es una instancia de axios configurada para el backend
        // y para la cloud function necesitamos una petición directa (o configurar otro axios instance)
        const user = (await import('../firebase/client')).auth.currentUser;
        const token = user ? await user.getIdToken() : '';

        // Nota: Asumimos que la Cloud Function espera { taskId: id } o similar, 
        // y que devuelve la tarea actualizada. 
        // Si la Cloud Function no devuelve la tarea, tendríamos que recargarla.
        const response = await fetch(cloudFunctionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ taskId: id })
        });

        if (!response.ok) {
            throw new Error('Error marking task as done via Cloud Function');
        }

        return await response.json();
    }
};
