import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import useApp from "../../../routes/useApp.js";

function AlertSuccess({...props}) {
    const {open, setOpen, type, message} = props
    const {handleRedirection} = useApp()


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        if (type === 'login' || type === 'register') {
            handleRedirection(type)
        }
        setOpen(false)
    }

    return (
        <div>
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
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
