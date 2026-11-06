import { createBrowserRouter, Navigate } from 'react-router';
import { RedirectIfAuthenticated, RequireAuth } from './features/auth/RequireAuth';
import { AppLayout } from './layouts/AppLayout';
import { GroupsPage } from './pages/GroupsPage';
import { GroupInfoPage } from './pages/group/GroupInfoPage';
import { GroupLayout } from './pages/group/GroupLayout';
import { JoinGroupPage } from './pages/JoinGroupPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterPage } from './pages/RegisterPage';
import { RoundPage } from './pages/RoundPage';
import { GroupPredictionsPage } from './pages/group/GroupPredictionsPage';
import { GroupStandingsPage } from './pages/group/GroupStandingsPage';

export const router = createBrowserRouter([
    {
        element: <RedirectIfAuthenticated />,
        children: [
            { path: '/login', element: <LoginPage /> },
            { path: '/registro', element: <RegisterPage /> },
        ],
    },
    {
        element: <RequireAuth />,
        children: [
            { path: '/unirse/:inviteCode', element: <JoinGroupPage /> },
            {
                element: <AppLayout />,
                children: [
                    { path: '/', element: <RoundPage /> },
                    { path: '/grupos', element: <GroupsPage /> },
                    {
                        path: '/grupos/:groupId',
                        element: <GroupLayout />,
                        children: [
                            { index: true, element: <Navigate to="clasificacion" replace /> },
                            { path: 'clasificacion', element: <GroupStandingsPage /> },
                            { path: 'pronosticos', element: <GroupPredictionsPage /> },
                            { path: 'grupo', element: <GroupInfoPage /> },
                        ],
                    },
                    { path: '/perfil', element: <ProfilePage /> },
                ],
            },
        ],
    },
    { path: '*', element: <Navigate to="/" replace /> },
]);
