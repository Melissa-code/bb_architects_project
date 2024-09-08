import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {style} from "./modalStyle.js"
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

function ModalExpiredToken({...props}) {
    const {open} = props
    const navigate = useNavigate()

    function handleClose() {
        localStorage.removeItem('BBStorage_token')
        navigate('/login')
    }

    return <Modal
        open={open}
        onClose={handleClose}
    >
        <Box sx={style}>
            <Typography sx={{fontSize: 16}} color="text.primary">
                Jeton expiré
            </Typography>
            <Typography
                sx={{fontSize: 16}}
                color="text.secondary"
                gutterBottom>
                Votre jeton a expiré ou est inexistant. Veuillez vous connecter.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleClose}>
                OK
            </Button>
        </Box>
    </Modal>
}

export default ModalExpiredToken