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


const router = createBrowserRouter([{path: '*', element: <Root />}])

export default function App() {
    return <RouterProvider router={router} />
}

function Root() {
    return (
        <Routes>
            <Route element={<Connexion />}>
                <Route path="login" element={<LoginForm />} />
                <Route path="register" element={<RegisterForm />} />
            </Route>
            <Route element={<Navigation />}>
                <Route path="home" element={<UserFileDataGrid />} />
                {/**<Route path='profile' element={}/>**/}
                <Route path="admin">
                    {/**<Route path='dashboard' element={}/>*/}
                    {/**<Route path='clients' element={}/>**/}
                    <Route path='storage/:id' element={<AdminFileDataGrid/>}/>
                </Route>
            </Route>
            <Route path="test" element={<AdminUserDataGrid />} />
        </Routes>
    )
}
