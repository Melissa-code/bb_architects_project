import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

function AlertSuccess({...props}) {
    const {open, setOpen} = props

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpen(false)
    }

    return (
        <div>
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{width: '100%'}}>
                    Connexion réussie. Veuillez patienter
                </Alert>
            </Snackbar>
        </div>
    )
}

export default AlertSuccess
