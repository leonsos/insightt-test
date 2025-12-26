import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    AppBar,
    Toolbar
} from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/client';
import { useAuth } from '../context/AuthContext';
import { TaskList } from '../components/TaskList';

export const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    const handleLogout = () => {
        signOut(auth);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Task List App
                    </Typography>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        {user?.email}
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Mis Tareas
                </Typography>
                <TaskList />
            </Container>
        </Box>
    );
};
