import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

function AlertFail({...props}) {
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
                    severity="error"
                    variant="filled"
                    sx={{width: '100%'}}>
                    Connexion échoué. Veuillez réessayer
                </Alert>
            </Snackbar>
        </div>
    )
}

export default AlertFail
