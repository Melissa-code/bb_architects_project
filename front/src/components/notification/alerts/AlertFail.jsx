import { Alert, Box, Button, Divider, Modal, Snackbar, Typography } from '@mui/material'
import { useState } from 'react'

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
}

function AlertFail({...props}) {
    const {open, setOpen, error} = props
    const [openModal, setOpenModal] = useState(false)

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpen(false)
    }

    const handleCloseModal = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpenModal(false)
    }

    const handleClick = () => {
        setOpenModal(true)
    }

    return (
        <div>
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{width: '100%'}}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={handleClick}>
                            Détails
                        </Button>
                    }>
                    Connexion échouée. Veuillez réessayer
                </Alert>
            </Snackbar>
            <div>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style}>
                <Typography>
                Une erreur a été rencontrée.
                </Typography>
                <Typography>
                Veuillez trouver le détail de l&apos;erreur ci-dessous
                </Typography>
                <Divider/>
                <Typography>
                    {error.message}
                </Typography>
                <Button onClick={handleClose}>
                Fermer
                </Button>
                </Box>
            </Modal>
        </div>
        </div>
    )
}

export default AlertFail
