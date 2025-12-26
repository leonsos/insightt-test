import React, { useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    IconButton,
    Checkbox,
    Paper,
    Typography,
    Box,
    Chip,
    Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TasksService } from '../services/tasks.service';
import type { Task } from '../services/tasks.service';
import { TaskForm } from './TaskForm';

export const TaskList: React.FC = () => {
    const queryClient = useQueryClient();
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const { data: tasks, isLoading, error } = useQuery({
        queryKey: ['tasks'],
        queryFn: TasksService.getAll,
    });

    const deleteMutation = useMutation({
        mutationFn: TasksService.delete,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    });

    const markDoneMutation = useMutation({
        mutationFn: TasksService.markAsDone,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    });

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('¿Seguro que deseas eliminar esta tarea?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleToggleDone = (task: Task) => {
        if (!task.done) {
            markDoneMutation.mutate(task.id);
        }
    };

    if (isLoading) return <Typography>Cargando tareas...</Typography>;
    if (error) return <Typography color="error">Error al cargar tareas</Typography>;

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Lista de Tareas ({tasks?.length || 0})</Typography>
                <Tooltip title="Agregar Nueva Tarea">
                    <Button variant="contained" onClick={() => { setEditingTask(null); setIsFormOpen(true); }}>
                        Nueva Tarea
                    </Button>
                </Tooltip>
            </Box>

            <Paper elevation={2}>
                <List>
                    {tasks?.length === 0 && (
                        <ListItem>
                            <ListItemText primary="No hay tareas aún. ¡Crea una!" />
                        </ListItem>
                    )}
                    {tasks?.map((task) => (
                        <ListItem
                            key={task.id}
                            secondaryAction={
                                <Box>
                                    <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(task)} sx={{ mr: 1 }}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(task.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </Box>
                            }
                            disablePadding
                            sx={{
                                p: 1,
                                borderBottom: '1px solid #f0f0f0',
                                backgroundColor: task.done ? '#f9fbe7' : 'inherit'
                            }}
                        >
                            <Checkbox
                                checked={task.done}
                                onChange={() => handleToggleDone(task)}
                                disabled={task.done || markDoneMutation.isPending}
                                icon={<CheckCircleIcon color="disabled" />}
                                checkedIcon={<CheckCircleIcon color="success" />}
                            />
                            <ListItemText
                                primary={
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            textDecoration: task.done ? 'line-through' : 'none',
                                            color: task.done ? 'text.secondary' : 'text.primary',
                                            fontWeight: 500
                                        }}
                                    >
                                        {task.title}
                                    </Typography>
                                }
                                secondary={
                                    <React.Fragment>
                                        {task.description && (
                                            <Typography variant="body2" color="text.secondary" display="block">
                                                {task.description}
                                            </Typography>
                                        )}
                                        <Typography variant="caption" color="text.disabled">
                                            Creada: {new Date(task.createdAt).toLocaleDateString()}
                                        </Typography>
                                        {task.done && <Chip label="Completada" size="small" color="success" variant="outlined" sx={{ ml: 1, height: 20 }} />}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <TaskForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                taskToEdit={editingTask}
            />
        </Box>
    );
};
import { Button } from '@mui/material'; // Added missing import
