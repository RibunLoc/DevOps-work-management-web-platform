import About from '@/pages/About';
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import PasswordRecovery from '@/pages/PasswordRecovery';
import Profile from '@/pages/Profile';
import ResetPassword from '@/pages/ResetPassword';
import Settings from '@/pages/Settings';
import Signup from '@/pages/Signup';
import TaskDashboard from '@/pages/TaskDashboard';
import { Route, Routes } from 'react-router-dom';
// import { Navigate } from 'react-router-dom';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/password-recovery" element={<PasswordRecovery />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/tasks" element={<TaskDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/tasks" element={<TaskDashboard />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
