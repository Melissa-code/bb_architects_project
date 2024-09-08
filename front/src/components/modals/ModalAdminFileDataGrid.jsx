import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {style} from "./modalStyle.js"

function ModalAdminFileDataGrid({...props}) {
    const {open, handleClose, data} = props

    console.log("data from Admin modal", data)
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Typography sx={{fontSize: 16}} color="text.primary">
                    Adresse email
                </Typography>
                <Typography
                    sx={{fontSize: 16}}
                    color="text.secondary"
                    gutterBottom>
                    {"data.user.email"}
                </Typography>
                <Typography sx={{fontSize: 16}} color="text.primary">
                    Adresse email
                </Typography>
                <Typography
                    sx={{fontSize: 16}}
                    color="text.secondary"
                    gutterBottom>
                    {"data.user.email"}
                </Typography>
            </Box>
        </Modal>

    );
}

export default ModalAdminFileDataGrid
