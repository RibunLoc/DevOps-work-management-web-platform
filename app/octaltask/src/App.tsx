import './styles/base.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import { ThemeProvider } from './contexts/ThemeContext'
import { UserProvider } from './contexts/UserContext'
import { TaskProvider } from './contexts/TaskContext'

function App() {
    return (
        <ThemeProvider>
            <UserProvider>
                <TaskProvider>
                    <BrowserRouter>
                        <AppRoutes />
                    </BrowserRouter>
                </TaskProvider>
            </UserProvider>
        </ThemeProvider>
    )
}

export default App
