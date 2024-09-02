import {
    createBrowserRouter,
    Route,
    RouterProvider,
    Routes,
} from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import Navigation from '../components/navigation/Navigation'
import StorageTable from '../components/storage/StorageTable'
import Connexion from '../pages/Connexion'
import FileDataGrid from '../components/table/FileDataGrid'


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
                <Route path="home" element={<FileDataGrid />} />
            </Route>
            <Route path="test" element={<StorageTable />} />
        </Routes>
    )
}
