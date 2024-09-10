import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {Divider} from "@mui/material";

function ModalAdminFileDataGrid({...props}) {
    const {open, handleClose, data} = props

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={{p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1}}>
                <Typography variant="h6" color="text.primary" sx={{mb: 2}}>
                    Informations Utilisateur
                </Typography>
                <Divider sx={{mb: 2}}/>
                <Box sx={{mb: 3}}>
                    <Typography variant="subtitle1" color="text.primary">
                        Adresse email
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {"data.user.email"}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle1" color="text.primary">
                        Autre information
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {"data.user.otherInfo"}
                    </Typography>
                </Box>
            </Box>
        </Modal>

    );
}

export default ModalAdminFileDataGrid
