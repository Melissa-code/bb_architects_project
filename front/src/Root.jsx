import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Routes,
} from 'react-router-dom'
import Home from './Home'
import Test from './Test'
const router = createBrowserRouter([{path: '*', element: <Root />}])

export default function App() {
    return <RouterProvider router={router} />
}

function Root() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<Test />} />
        </Routes>
    )
}
