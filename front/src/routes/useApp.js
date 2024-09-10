import {useNavigate} from "react-router-dom";
import {getUserRole} from "../utils/jwt.js";

function useApp(){
    const navigate = useNavigate()

    function handleRedirection(type) {
        if (type === 'login') {
            const {roles} = getUserRole()
            if(roles.includes('ROLE_ADMIN')){
                navigate('/admin/dashboard')
            } else {
                navigate('/user/storage')
            }
        }
        if (type === 'register') {
            navigate('/login')
        }
    }

    return {handleRedirection}

}

export default useApp
