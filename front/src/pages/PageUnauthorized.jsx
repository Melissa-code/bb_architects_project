import {useNavigate} from "react-router-dom";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {jwtDecode} from "jwt-decode";

function PageUnauthorized() {
    const navigate = useNavigate()
    const token = localStorage.getItem('BBStorage_token');
    const decodedToken = jwtDecode(token);

    const handleClose = () => {
        const {roles} = decodedToken
        if (roles.includes("ROLE_USER")) {
            navigate('/user')
        } else if (roles.includes("ROLE_ADMIN")) {
            navigate('/admin')
        } else {
            localStorage.removeItem('BBStorage_token')
            navigate('/login')
        }
    }

    return (
        <React.Fragment>
            <Dialog
                open={true}
                onClose={handleClose}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Non Autorisé"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Vous n&apos;êtes pas autorisé à accéder à cette page.
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

export default PageUnauthorized