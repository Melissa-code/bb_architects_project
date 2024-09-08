import {useEffect, useState} from 'react';
import {jwtDecode} from 'jwt-decode';
import {useNavigate} from 'react-router-dom'
import ModalExpiredToken from "./modals/ModalExpiredToken.jsx";

const ProtectedRoute = ({children}) => {
    const [openModal, setOpenModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('BBStorage_token');

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Math.floor(Date.now() / 1000);

                if (decodedToken.exp < currentTime) {
                    localStorage.removeItem('BBStorage_token')
                    setOpenModal(true)
                }


            } catch (error) {
                setOpenModal(true)
            }
        } else {
            setOpenModal(true)
        }
    }, [navigate]);

    return (
        <>
            {children}
            <ModalExpiredToken open={openModal} setOpen={setOpenModal} history={navigate}/>
        </>
    )
};

export default ProtectedRoute;
