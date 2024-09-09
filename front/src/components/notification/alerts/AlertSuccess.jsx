import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import useApp from "../../../routes/useApp.js";
import {useNavigate} from "react-router-dom";

function AlertSuccess({...props}) {
    const {open, setOpen, type, message} = props
    const {handleRedirection} = useApp()
    const navigate = useNavigate()


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        if (type === 'login' || type === 'register') {
            handleRedirection(type)
        }
        if (type === "deleteUser") {
            localStorage.removeItem("BBStorage_token")
            navigate('/login')
        }
        setOpen(false)
    }

    return (
        <div>
            <Snackbar open={open} autoHideDuration={1500} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{width: '100%'}}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default AlertSuccess
