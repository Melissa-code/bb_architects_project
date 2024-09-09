import {
    createBrowserRouter, Navigate,
    Route,
    RouterProvider,
    Routes,
} from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import Navigation from '../components/navigation/Navigation'
import Connexion from '../pages/Connexion'
import AdminUserDataGrid from "../components/table/AdminUserDataGrid.jsx";
import AdminFileDataGrid from "../components/table/AdminFileDataGrid.jsx";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import RedirectPage from "../components/navigation/RedirectPage.jsx";
import PageUserStorage from "../pages/PageUserStorage.jsx";
import PageUserProfile from "../pages/PageUserProfile.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import PageAdminDashboard from "../pages/PageAdminDashboard.jsx";
import PageAdminClients from "../pages/PageAdminClients.jsx";
import PageNotFound from "../pages/PageNotFound.jsx";

const router = createBrowserRouter([{path: '*', element: <Root/>}])
const themeOptions = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#ffc107',
        },
        secondary: {
            main: '#023e8a',
            light: '#1e62b8',
            dark: '#03045e',
        },
        text: {
            primary: 'rgba(33, 33, 33, 1)',
            secondary: 'rgba(33,33,33,0.6)',
            disabled: 'rgba(33,33,33,0.38)',
        },
    },
})

export default function App() {

    return <ThemeProvider theme={themeOptions}>
        <RouterProvider router={router}/>
    </ThemeProvider>
}

function Root() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace/>}/>
            <Route element={<Connexion/>}>
                <Route path="login" element={<LoginForm/>}/>
                <Route path="register" element={<RegisterForm/>}/>
            </Route>
            <Route element={<Navigation/>}>
                <Route path="user">
                    <Route path="" element={<Navigate to="/user/storage" replace/>}/>
                    <Route path="storage" element={<ProtectedRoute><PageUserStorage/></ProtectedRoute>}/>
                    <Route path="profile" element={<ProtectedRoute><PageUserProfile/></ProtectedRoute>}/>
                </Route>
                <Route path="admin">
                    <Route path="" element={<Navigate to="/admin/dashboard" replace/>}/>
                    <Route path='dashboard' element={<ProtectedRoute><PageAdminDashboard/></ProtectedRoute>}/>
                    <Route path='clients' element={<ProtectedRoute><PageAdminClients/></ProtectedRoute>}/>
                    <Route path='storage/:id' element={<ProtectedRoute><AdminFileDataGrid/></ProtectedRoute>}
                    />
                </Route>
            </Route>

            <Route path="download/:id" element={<RedirectPage/>}/>
            <Route path="*" element={<PageNotFound/>}/>
        </Routes>
    )
}
