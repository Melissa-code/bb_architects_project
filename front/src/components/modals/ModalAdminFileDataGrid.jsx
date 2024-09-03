import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function ModalAdminFileDataGrid({...props}) {
const {open, handleClose, data}=props

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
