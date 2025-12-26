import React, { useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Box
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TasksService } from '../services/tasks.service';
import type { UpdateTaskDto, Task } from '../services/tasks.service';

const schema = z.object({
    title: z.string().min(1, 'El título es requerido'),
    description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface TaskFormProps {
    open: boolean;
    onClose: () => void;
    taskToEdit?: Task | null;
}

export const TaskForm: React.FC<TaskFormProps> = ({ open, onClose, taskToEdit }) => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        if (taskToEdit) {
            setValue('title', taskToEdit.title);
            setValue('description', taskToEdit.description || '');
        } else {
            reset({ title: '', description: '' });
        }
    }, [taskToEdit, setValue, reset]);

    const createMutation = useMutation({
        mutationFn: TasksService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            reset();
            onClose();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateTaskDto }) => TasksService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            reset();
            onClose();
        },
    });

    const onSubmit = (data: FormData) => {
        if (taskToEdit) {
            updateMutation.mutate({ id: taskToEdit.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{taskToEdit ? 'Editar Tarea' : 'Nueva Tarea'}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Título"
                            fullWidth
                            autoFocus
                            error={!!errors.title}
                            helperText={errors.title?.message}
                            {...register('title')}
                        />
                        <TextField
                            label="Descripción"
                            fullWidth
                            multiline
                            rows={3}
                            {...register('description')}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="inherit">Cancelar</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={createMutation.isPending || updateMutation.isPending}
                    >
                        {taskToEdit ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
