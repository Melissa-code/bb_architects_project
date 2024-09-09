import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material'
import {useMutation} from "@tanstack/react-query"
import {fetchDeleteUser} from "../../utils/fetch.js";
import {useState} from "react";
import AlertSuccess from "../notification/alerts/AlertSuccess.jsx";
import AlertFail from "../notification/alerts/AlertFail.jsx";

function ProfileConfirmDelete({...props}) {
    const {open, setOpen, id} = props
    const token = localStorage.getItem('BBStorage_token')
    const [openAlertSuccess, setOpenAlertSuccess] = useState(false)
    const [openAlertFailure, setOpenAlertFailure] = useState(false)
    const [error, setError] = useState("")

    const {mutate} = useMutation({
        mutationKey: ["Delete user", id],
        mutationFn: async () => {
            await fetchDeleteUser(token, id)
        },
        onSuccess: () => {
            setOpenAlertSuccess(true)
        },
        onError: (error) => {
            setError(error)
            setOpenAlertFailure(true)
        },
    })

    const handleClose = () => {
        setOpen(false)
    }

    return (<>
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
                        onClick={() => mutate()}
                        autoFocus
                        color="error"
                        variant="contained">
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
            <AlertSuccess open={openAlertSuccess} setOpen={setOpenAlertSuccess} type={"deleteUser"}
                          message={"Compte supprimé ! Redirection..."}/>
            <AlertFail open={openAlertFailure} setOpen={setOpenAlertFailure} error={error}
                       message={"Erreur lors de la suppression du compte."}/>
        </>


    )
}

export default ProfileConfirmDelete
