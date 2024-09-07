import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

function DialogUserFileDelete({...props}) {
    const {open, handleClose, handleDelete} = props

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
                    Êtes-vous sûr de vouloir procéder à la suppression de ce fichier ?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Annuler</Button>
                <Button
                    onClick={handleDelete}
                    autoFocus
                    color="error"
                    variant="contained">
                    Supprimer
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogUserFileDelete