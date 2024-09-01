import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material'

function ProfileConfirmDelete({...props}) {
    const {open, setOpen} = props

    const handleClose = () => {
        setOpen(false)
    }

    const handleDeleteUser = () => {
        alert('Suppression du compte réalisée')
        handleClose()
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
                {'Suppression de votre compte'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Êtes-vous sûr de vouloir procéder à la suppression de votre
                    compte ?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Annuler</Button>
                <Button
                    onClick={handleDeleteUser}
                    autoFocus
                    color="error"
                    variant="contained">
                    Supprimer
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ProfileConfirmDelete
