import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useNavigate} from "react-router-dom";

function PageNotFound() {
    const navigate = useNavigate()

    const handleClose = () => {
        navigate(-1)
    }

    return (
        <React.Fragment>
            <Dialog
                open={true}
                onClose={handleClose}
            >
                <DialogTitle id="alert-dialog-title">
                    {"404 - Page introuvable"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Erreur 404. Page introuvable.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Retour
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default PageNotFound
