import { createBrowserRouter, Navigate } from 'react-router';
import { AppLoader } from './components/AppLoader';
import { RedirectIfAuthenticated, RequireAuth } from './features/auth/RequireAuth';
import { AppLayout } from './layouts/AppLayout';
import { GroupLayout } from './pages/group/GroupLayout';

// Cada página se descarga la primera vez que se visita, no al abrir la app.
// Los layouts se quedan en el paquete principal porque se necesitan siempre.
export const router = createBrowserRouter([
    {
        HydrateFallback: AppLoader,
        children: [
            {
                element: <RedirectIfAuthenticated />,
                children: [
                    {
                        path: '/login',
                        lazy: () =>
                            import('./pages/LoginPage').then((m) => ({ Component: m.LoginPage })),
                    },
                    {
                        path: '/registro',
                        lazy: () =>
                            import('./pages/RegisterPage').then((m) => ({
                                Component: m.RegisterPage,
                            })),
                    },
                ],
            },
            {
                element: <RequireAuth />,
                children: [
                    {
                        path: '/unirse/:inviteCode',
                        lazy: () =>
                            import('./pages/JoinGroupPage').then((m) => ({
                                Component: m.JoinGroupPage,
                            })),
                    },
                    {
                        element: <AppLayout />,
                        children: [
                            {
                                path: '/',
                                lazy: () =>
                                    import('./pages/RoundPage').then((m) => ({
                                        Component: m.RoundPage,
                                    })),
                            },
                            {
                                path: '/grupos',
                                lazy: () =>
                                    import('./pages/GroupsPage').then((m) => ({
                                        Component: m.GroupsPage,
                                    })),
                            },
                            {
                                path: '/grupos/:groupId',
                                element: <GroupLayout />,
                                children: [
                                    {
                                        index: true,
                                        element: <Navigate to="clasificacion" replace />,
                                    },
                                    {
                                        path: 'clasificacion',
                                        lazy: () =>
                                            import('./pages/group/GroupStandingsPage').then(
                                                (m) => ({
                                                    Component: m.GroupStandingsPage,
                                                }),
                                            ),
                                    },
                                    {
                                        path: 'pronosticos',
                                        lazy: () =>
                                            import('./pages/group/GroupPredictionsPage').then(
                                                (m) => ({
                                                    Component: m.GroupPredictionsPage,
                                                }),
                                            ),
                                    },
                                    {
                                        path: 'grupo',
                                        lazy: () =>
                                            import('./pages/group/GroupInfoPage').then((m) => ({
                                                Component: m.GroupInfoPage,
                                            })),
                                    },
                                ],
                            },
                            {
                                path: '/perfil',
                                lazy: () =>
                                    import('./pages/ProfilePage').then((m) => ({
                                        Component: m.ProfilePage,
                                    })),
                            },
                        ],
                    },
                ],
            },
            { path: '*', element: <Navigate to="/" replace /> },
        ],
    },
]);
