import { RouteProps } from '../../routes/Routes.types';
import { PasswordRecoveryPage } from './pages/PasswordRecoveryPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';

export const authRoutes: RouteProps[] = [
  { path: '/signin', element: <SignInPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/password-recovery', element: <PasswordRecoveryPage /> },
];
