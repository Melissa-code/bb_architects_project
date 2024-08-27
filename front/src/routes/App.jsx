import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Routes,
} from 'react-router-dom'
import Connexion from '../pages/Connexion'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import Navigation from '../components/navigation/Navigation'
import StorageTable from '../components/storage/StorageTable'

const router = createBrowserRouter([{path: '*', element: <Root />}])

export default function App() {
    return <RouterProvider router={router} />
}

function Root() {
    return (
        <Routes>
            <Route path="connect" element={<Connexion />}>
                <Route path="login" element={<LoginForm />} />
                <Route path="register" element={<RegisterForm />} />
            </Route>
            <Route path="home" element={<Navigation />}></Route>
            <Route path="test" element={<StorageTable />} />
        </Routes>
    )
}
