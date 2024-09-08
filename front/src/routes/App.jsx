import {
    createBrowserRouter,
    Route,
    RouterProvider,
    Routes,
} from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import Navigation from '../components/navigation/Navigation'
import Connexion from '../pages/Connexion'
import UserFileDataGrid from '../components/table/UserFileDataGrid.jsx'
import AdminUserDataGrid from "../components/table/AdminUserDataGrid.jsx";
import AdminFileDataGrid from "../components/table/AdminFileDataGrid.jsx";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import RedirectPage from "../components/navigation/RedirectPage.jsx";

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
            <Route element={<Connexion/>}>
                <Route path="login" element={<LoginForm/>}/>
                <Route path="register" element={<RegisterForm/>}/>
            </Route>
            <Route element={<Navigation/>}>
                <Route path="user" handle={{
                    crumb: () => {
                        return "Utilisateur"
                    }
                }}>
                    <Route path="storage" element={<UserFileDataGrid/>} handle={{
                        crumb: () => {
                            return "Stockage"
                        }
                    }}/>
                    {/**<Route path="profile" element={}/>*/}
                </Route>
                <Route path="admin" handle={{
                    crumb: () => {
                        return "Administration"
                    }
                }}>
                    {/**<Route path='dashboard' element={}/>*/}
                    <Route path='clients' element={<AdminUserDataGrid/>} handle={{
                        crumb: () => {
                            return "Clients"
                        }
                    }}/>
                    <Route path='storage/:id' element={<AdminFileDataGrid/>} handle={{
                        crumb: () => {
                            return "Stockage client"
                        }
                    }}/>
                </Route>
            </Route>
            <Route path="download/:id" element={<RedirectPage/>}/>
        </Routes>
    )
}
